import sys
import os
import unittest

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv
load_dotenv()

from services.retrieval import get_supabase_client

EXPECTED_CHUNKS = {
    "about":        2,
    "skills":       4,
    "projects":     5,
    "experience":   2,
    "education":    2,
    "achievements": 1,
    "contact":      1,
    "faq":          4
}

class TestIngestion(unittest.TestCase):
    def test_all_chunks_present(self):
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("TEST: All knowledge chunks in Supabase")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

        client = get_supabase_client()
        self.assertIsNotNone(client, "Supabase client is not initialized")
        
        all_pass = True

        for section, expected_count in EXPECTED_CHUNKS.items():
            result = client.table("portfolio_chunks") \
                .select("id, title") \
                .eq("section", section) \
                .execute()

            actual_count = len(result.data)

            if actual_count >= expected_count:
                print(f"  ✅ {section:<15} {actual_count}/{expected_count} chunks")
            else:
                print(f"  ❌ {section:<15} {actual_count}/{expected_count} chunks — MISSING!")
                all_pass = False

        total_expected = sum(EXPECTED_CHUNKS.values())
        result_all = client.table("portfolio_chunks") \
            .select("id", count="exact") \
            .execute()
        total_actual = result_all.count

        print(f"\n  Total chunks: {total_actual}/{total_expected}")
        self.assertTrue(all_pass, "Some categories are missing required chunks")

if __name__ == "__main__":
    unittest.main()

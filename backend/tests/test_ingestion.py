import sys
import os
import unittest
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

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
        print("TEST: All knowledge chunks in Local Index")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

        current_dir = os.path.dirname(os.path.abspath(__file__))
        embeddings_path = os.path.join(current_dir, "..", "data", "knowledgeBaseEmbeddings.json")
        
        self.assertTrue(os.path.exists(embeddings_path), "Local embeddings JSON file is missing")
        
        with open(embeddings_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        all_pass = True

        for section, expected_count in EXPECTED_CHUNKS.items():
            section_chunks = [c for c in data if c.get("section") == section]
            actual_count = len(section_chunks)

            if actual_count >= expected_count:
                print(f"  ✅ {section:<15} {actual_count}/{expected_count} chunks")
            else:
                print(f"  ❌ {section:<15} {actual_count}/{expected_count} chunks — MISSING!")
                all_pass = False

        total_expected = sum(EXPECTED_CHUNKS.values())
        total_actual = len(data)

        print(f"\n  Total chunks: {total_actual}/{total_expected}")
        self.assertTrue(all_pass, "Some categories are missing required chunks")

if __name__ == "__main__":
    unittest.main()


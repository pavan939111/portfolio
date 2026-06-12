import asyncio
import sys
import os
import unittest

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv
load_dotenv()

from services.retrieval import get_supabase_client
from services.embeddings import embed_query

class TestSupabaseIntegration(unittest.IsolatedAsyncioTestCase):
    async def test_supabase_connection(self):
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("TEST: Supabase connection")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

        client = get_supabase_client()
        self.assertIsNotNone(client, "Supabase client is not initialized")

        # Check table exists and is readable
        result = client.table("portfolio_chunks") \
            .select("id, section, title") \
            .limit(5) \
            .execute()

        self.assertIsNotNone(result.data, "portfolio_chunks table not found or not readable")
        print("✅ Supabase connected")

        # Get total count
        count_result = client.table("portfolio_chunks") \
            .select("id", count="exact") \
            .execute()

        total = count_result.count
        print(f"   Total chunks in DB: {total}")

        self.assertTrue(total > 0, "No chunks found in DB! Ingest data first.")

    async def test_match_chunks_function(self):
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("TEST: match_chunks SQL function")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

        query = "What are Pavan's skills?"
        embedding = await embed_query(query)

        client = get_supabase_client()
        result = client.rpc(
            "match_chunks",
            {
                "query_embedding": embedding,
                "match_threshold": 0.3,
                "match_count": 4
            }
        ).execute()

        self.assertIsNotNone(result.data, "match_chunks function failed or not created")
        print("✅ match_chunks function works")
        print(f"   Results for 'What are Pavan's skills?':")

        for row in result.data:
            print(
                f"   [{row['section']}] "
                f"{row['title'][:35]} "
                f"→ similarity: {row['similarity']:.4f}"
            )

        self.assertTrue(len(result.data) > 0, "No results returned — check embeddings exist")

if __name__ == "__main__":
    unittest.main()

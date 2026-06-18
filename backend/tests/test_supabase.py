import asyncio
import sys
import os
import unittest

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv
load_dotenv()

from services.retrieval import get_supabase_client

class TestSupabaseIntegration(unittest.IsolatedAsyncioTestCase):
    async def test_supabase_connection(self):
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("TEST: Supabase connection")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

        client = get_supabase_client()
        self.assertIsNotNone(client, "Supabase client is not initialized")

        # Check table exists and is readable
        result = client.table("agent_runs") \
            .select("id, session_id") \
            .limit(5) \
            .execute()

        self.assertIsNotNone(result.data, "agent_runs table not found or not readable")
        print("✅ Supabase connected and agent_runs is readable")


if __name__ == "__main__":
    unittest.main()

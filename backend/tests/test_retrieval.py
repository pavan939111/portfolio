import unittest
import sys
import os

# Add parent directory to path
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

from services.retrieval import local_fallback_search, retrieve_chunks
from config.settings import get_settings

class TestRetrieval(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.settings = get_settings()

    def test_local_fallback_search(self):
        results = local_fallback_search("skills", match_count=2)
        self.assertTrue(len(results) <= 2)
        if results:
            self.assertIsNotNone(results[0].title)
            self.assertIsNotNone(results[0].content)

    async def test_retrieve_chunks_fallback_workflow(self):
        # Passing empty/dummy embedding should fallback gracefully
        results = await retrieve_chunks(
            query_embedding=[0.0]*self.settings.VOYAGE_EMBEDDING_DIM,
            match_count=2,
            query_text="skills"
        )
        self.assertTrue(len(results) > 0)

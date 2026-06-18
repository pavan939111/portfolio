import asyncio
import sys
import os
import unittest
from unittest.mock import patch, MagicMock

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from services.embeddings import (
    embed_query,
    embed_document,
    embed_batch
)
from config.settings import get_settings

class MockEmbeddingsResult:
    def __init__(self, embeddings):
        self.embeddings = embeddings

class TestEmbeddingsIntegration(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.settings = get_settings()

    @patch("services.embeddings.get_voyage_client")
    async def test_embed_query(self, mock_get_client):
        mock_client = MagicMock()
        mock_client.embed.return_value = MockEmbeddingsResult([[0.1] * self.settings.VOYAGE_EMBEDDING_DIM])
        mock_get_client.return_value = mock_client

        text = "What skills does Pavan have?"
        embedding = await embed_query(text)

        # Check 1: Returns a list
        self.assertIsInstance(embedding, list, "Embedding is not a list")

        # Check 2: Correct dimension
        self.assertEqual(len(embedding), self.settings.VOYAGE_EMBEDDING_DIM, f"Wrong dim: {len(embedding)}")

        # Check 3: Values are floats
        self.assertTrue(all(isinstance(v, float) for v in embedding), "Embedding values are not floats")

        # Check 4: Not all zeros
        self.assertTrue(any(v != 0.0 for v in embedding), "Embedding is all zeros")

    @patch("services.embeddings.get_voyage_client")
    async def test_embed_document(self, mock_get_client):
        mock_client = MagicMock()
        mock_client.embed.return_value = MockEmbeddingsResult([[0.2] * self.settings.VOYAGE_EMBEDDING_DIM])
        mock_get_client.return_value = mock_client

        text = "Pavan is an AI Engineer specializing in RAG"
        embedding = await embed_document(text)
        self.assertEqual(len(embedding), self.settings.VOYAGE_EMBEDDING_DIM, f"Wrong dim: {len(embedding)}")

    @patch("services.embeddings.get_voyage_client")
    async def test_embed_batch(self, mock_get_client):
        mock_client = MagicMock()
        dim = self.settings.VOYAGE_EMBEDDING_DIM
        mock_client.embed.return_value = MockEmbeddingsResult([
            [0.1] * dim,
            [0.2] * dim,
            [0.3] * dim
        ])
        mock_get_client.return_value = mock_client

        texts = [
            "LangChain and LangGraph expertise",
            "FastAPI backend development",
            "Multi-agent orchestration"
        ]
        embeddings = await embed_batch(texts)
        self.assertEqual(len(embeddings), 3, f"Wrong count: {len(embeddings)}")

        for i, emb in enumerate(embeddings):
            self.assertEqual(len(emb), self.settings.VOYAGE_EMBEDDING_DIM, f"Chunk {i} wrong dim: {len(emb)}")

    @patch("services.embeddings.get_voyage_client")
    async def test_query_doc_different(self, mock_get_client):
        mock_client = MagicMock()
        dim = self.settings.VOYAGE_EMBEDDING_DIM
        mock_client.embed.side_effect = [
            MockEmbeddingsResult([[0.1] * dim]),
            MockEmbeddingsResult([[0.2] * dim])
        ]
        mock_get_client.return_value = mock_client

        same_text = "Pavan Kumar AI Engineer"
        q_emb = await embed_query(same_text)
        d_emb = await embed_document(same_text)
        self.assertNotEqual(q_emb, d_emb, "Query and document embeddings should differ")

if __name__ == "__main__":
    unittest.main()

import unittest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
import sys
import os

# Add parent directory to path
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

from main import app
from models.responses import ChatResponse, EmbedResponse

class TestRoutes(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_route(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "healthy")
        self.assertTrue("claude_model" in data)

    @patch("routes.embed.embed_query", new_callable=AsyncMock)
    def test_embed_route_success(self, mock_embed_query):
        mock_embed_query.return_value = [0.0] * 1024
        res = self.client.post("/api/embed", json={"text": "hello test"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue("embedding" in data)
        self.assertEqual(data["dimension"], 1024)

    @patch("routes.chat.run_rag_pipeline", new_callable=AsyncMock)
    def test_chat_route_success(self, mock_run_pipeline):
        # Create a mock response
        mock_run_pipeline.return_value = ChatResponse(
            response="Hello world response",
            sources=["about"],
            chunks_used=1
        )
        res = self.client.post("/api/chat", json={"message": "hello", "history": []})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["response"], "Hello world response")
        self.assertEqual(data["sources"], ["about"])

    def test_projects_route(self):
        res = self.client.get("/api/projects")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue("projects" in data)
        self.assertTrue("source" in data)

    def test_telemetry_route(self):
        res = self.client.get("/api/telemetry")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue("summary" in data)
        self.assertTrue("weeklyAnalytics" in data)
        self.assertTrue("recentLogs" in data)
        self.assertTrue("toolUsage" in data)

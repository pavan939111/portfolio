import asyncio
import sys
import os
import unittest

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv
load_dotenv()

from services.llm import get_llm_response
from models.entities import RetrievedChunk, Message

class TestLLMIntegration(unittest.IsolatedAsyncioTestCase):
    async def test_llm_basic(self):
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("TEST: LLM basic response")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

        # Fake a chunk so we don't need DB yet
        fake_chunks = [
            RetrievedChunk(
                id=1,
                section="skills",
                title="Agentic AI Frameworks",
                content=(
                    "Pavan specializes in LangChain, "
                    "LangGraph, CrewAI, and RAG pipelines"
                ),
                similarity=0.92
            )
        ]

        answer = await get_llm_response(
            message="What is Pavan's main skill?",
            history=[],
            chunks=fake_chunks
        )

        self.assertIsInstance(answer, str, "Response is not a string")
        self.assertTrue(len(answer) > 10, "Response is too short")
        self.assertTrue("pavan" in answer.lower(), "Response doesn't mention Pavan")

        print(f"✅ LLM responded")
        print(f"   Answer: {answer[:100]}...")

    async def test_llm_no_hallucination(self):
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("TEST: LLM doesn't hallucinate")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

        # Ask about something NOT in context
        fake_chunks = [
            RetrievedChunk(
                id=1,
                section="about",
                title="Personal Introduction",
                content="Pavan is an AI Engineer at RGUKT",
                similarity=0.6
            )
        ]

        answer = await get_llm_response(
            message="What is Pavan's salary?",
            history=[],
            chunks=fake_chunks
        )

        print(f"   Answer: {answer}")
        print("✅ Check manually: Does it say 'don't have that detail'? If yes, hallucination guard works")

    async def test_llm_with_history(self):
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("TEST: LLM uses conversation history")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

        history = [
            Message(role="user", content="Tell me about Pavan's projects"),
            Message(role="assistant", content="Pavan built FailureRAG and Nina...")
        ]

        fake_chunks = [
            RetrievedChunk(
                id=1,
                section="projects",
                title="Nina SDK",
                content="Nina is a voice navigation SDK",
                similarity=0.88
            )
        ]

        answer = await get_llm_response(
            message="Tell me more about Nina specifically",
            history=history,
            chunks=fake_chunks
        )

        self.assertIsInstance(answer, str)
        print(f"✅ History-aware response:")
        print(f"   {answer[:100]}...")

if __name__ == "__main__":
    unittest.main()

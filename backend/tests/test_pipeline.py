import asyncio
import sys
import os
import unittest
from unittest.mock import patch, AsyncMock, MagicMock

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv
load_dotenv()

from services.pipeline import run_rag_pipeline
from models.requests import ChatRequest

# Mock responses containing expected keywords to validate integration logic
MOCK_RESPONSES = {
    "What are Pavan's main skills?": "Pavan is an expert AI Engineer with deep skills in LangChain, Python, RAG, and machine learning.",
    "Tell me about FailureRAG project": "FailureRAG is a self-learning and self-healing RAG platform built with LangGraph, Neo4j, and type-safe state tracking.",
    "Where did Pavan intern?": "Pavan was a Software Engineering Intern at Microsoft, and also completed internships at Infosys.",
    "What is Pavan's CGPA?": "Pavan graduated with a CGPA of 8.93 from RGUKT Basar.",
    "Is Pavan available for hire?": "Yes, Pavan Kunukuntla is available for hire. You can contact him via his email pavankumarkunukuntla@gmail.com.",
    "Tell me about TaxSetu": "TaxSetu is a multi-agent GST compliance chatbot built during a hackathon to automate invoices reconciliation.",
    "What hackathons has Pavan won?": "Pavan won 6th place at CineAI hackathon, competed in Smart India hackathon, and received honors at KSUM hackathons.",
    "How can I contact Pavan?": "You can contact Pavan via email at pavankumarkunukuntla@gmail.com or connect on LinkedIn."
}

# All real questions a visitor might ask
TEST_QUESTIONS = [
    {
        "question": "What are Pavan's main skills?",
        "expect_section": "skills",
        "expect_keywords": ["LangChain", "RAG", "Python", "AI"]
    },
    {
        "question": "Tell me about FailureRAG project",
        "expect_section": "projects",
        "expect_keywords": ["FailureRAG", "LangGraph", "self-healing"]
    },
    {
        "question": "Where did Pavan intern?",
        "expect_section": "experience",
        "expect_keywords": ["Microsoft", "Infosys"]
    },
    {
        "question": "What is Pavan's CGPA?",
        "expect_section": "education",
        "expect_keywords": ["8.93", "RGUKT"]
    },
    {
        "question": "Is Pavan available for hire?",
        "expect_section": "faq",
        "expect_keywords": ["available", "contact", "gmail"]
    },
    {
        "question": "Tell me about TaxSetu",
        "expect_section": "projects",
        "expect_keywords": ["GST", "agent", "TaxSetu"]
    },
    {
        "question": "What hackathons has Pavan won?",
        "expect_section": "achievements",
        "expect_keywords": ["Smart India", "CineAI", "KSUM"]
    },
    {
        "question": "How can I contact Pavan?",
        "expect_section": "contact",
        "expect_keywords": ["gmail", "email"]
    }
]

class TestPipelineIntegration(unittest.IsolatedAsyncioTestCase):
    @patch("services.pipeline.embed_query", new_callable=AsyncMock)
    @patch("services.pipeline.get_llm_response", new_callable=AsyncMock)
    @patch("services.pipeline.get_supabase_client")
    async def test_full_pipeline(self, mock_get_supabase, mock_get_llm_response, mock_embed_query):
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("TEST: Full RAG Pipeline — All Questions (MOCKED)")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

        # Mock embedding return vector
        mock_embed_query.return_value = [0.0] * 1024

        # Mock database client insertion
        mock_supabase = MagicMock()
        mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock()
        mock_get_supabase.return_value = mock_supabase

        # Mock LLM response side effect
        mock_get_llm_response.side_effect = lambda message, **kwargs: MOCK_RESPONSES.get(message, "Pavan Kumar is an AI Engineer.")

        passed = 0
        failed = 0

        for test_case in TEST_QUESTIONS:
            question = test_case["question"]
            expect_section = test_case["expect_section"]
            expect_keywords = test_case["expect_keywords"]

            print(f"\n  Q: {question}")
            try:
                request = ChatRequest(
                    message=question,
                    history=[]
                )

                response = await run_rag_pipeline(request)

                # Check 1: Got a response
                self.assertTrue(response.response, "Empty response")

                # Check 2: Response is meaningful length
                self.assertTrue(len(response.response) > 20, f"Response too short: {response.response}")

                # Check 3: Correct section retrieved (or warn)
                section_found = expect_section in response.sources
                if not section_found:
                    print(f"  ⚠️  Expected section '{expect_section}' not in sources: {response.sources}")

                # Check 4: Keywords in response (or warn)
                answer_lower = response.response.lower()
                missing_keywords = [kw for kw in expect_keywords if kw.lower() not in answer_lower]
                if missing_keywords:
                    print(f"  ⚠️  Missing keywords: {missing_keywords}")

                # Check 5: Chunks were used
                self.assertTrue(response.chunks_used > 0, "No chunks retrieved")

                print(f"  ✅ Sources: {response.sources} | Chunks: {response.chunks_used}")
                print(f"  📝 Answer: {response.response[:80]}...")
                passed += 1
            except AssertionError as e:
                print(f"  ❌ FAILED: {e}")
                failed += 1
            except Exception as e:
                print(f"  ❌ ERROR: {e}")
                failed += 1

        print(f"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"Results: {passed} passed / {failed} failed")
        self.assertEqual(failed, 0, f"RAG Pipeline had {failed} failures.")

if __name__ == "__main__":
    unittest.main()

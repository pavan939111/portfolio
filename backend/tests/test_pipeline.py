import asyncio
import sys
import os
import unittest

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv
load_dotenv()

from services.pipeline import run_rag_pipeline
from models.requests import ChatRequest

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
    async def test_full_pipeline(self):
        print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("TEST: Full RAG Pipeline — All Questions")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

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

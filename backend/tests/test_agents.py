import unittest

from app import agents, llm, registry


class AgentLoopTest(unittest.TestCase):
    """Exercise the tool-call loop with a scripted LLM and a fake tool —
    no OpenAI key, Chroma, or embeddings required."""

    def setUp(self):
        self._saved_tools = dict(registry.TOOL_REGISTRY)
        self._saved_llm = llm.chat_completion
        registry.TOOL_REGISTRY.clear()
        agents.CONVERSATIONS.clear()

        @registry.tool
        def query_rag(question: str, k: int = 5) -> dict:
            "Semantic search over the documents."
            return {
                "text": "Paris is the capital of France.",
                "chunks": [{"source": "geo.pdf", "page": 2}],
            }

        self._calls = 0

        def fake_chat_completion(messages, tools=None):
            self._calls += 1
            if self._calls == 1:
                # first turn: model asks to call the tool
                return {
                    "content": None,
                    "tool_calls": [
                        {
                            "id": "call_1",
                            "name": "query_rag",
                            "arguments": {"question": "capital of France?"},
                        }
                    ],
                    "finish_reason": "tool_calls",
                }
            # second turn: model answers from the tool output
            return {"content": "Paris.", "tool_calls": [], "finish_reason": "stop"}

        agents.llm.chat_completion = fake_chat_completion

    def tearDown(self):
        agents.llm.chat_completion = self._saved_llm
        registry.TOOL_REGISTRY.clear()
        registry.TOOL_REGISTRY.update(self._saved_tools)
        agents.CONVERSATIONS.clear()

    def test_loop_calls_tool_then_answers_with_citations(self):
        result = agents.send_chat("What is the capital of France?")
        self.assertEqual(result["answer"], "Paris.")
        self.assertEqual(result["citations"], [{"source": "geo.pdf", "page": 2}])
        self.assertTrue(result["conversation_id"])
        self.assertEqual(self._calls, 2)

    def test_history_records_the_full_exchange(self):
        result = agents.send_chat("What is the capital of France?")
        history = agents.get_conversation_history(result["conversation_id"])
        roles = [m["role"] for m in history]
        self.assertEqual(roles, ["system", "user", "assistant", "tool", "assistant"])

    def test_followup_reuses_conversation(self):
        first = agents.send_chat("What is the capital of France?")
        self._calls = 1  # force the next call to be a final answer
        second = agents.send_chat("Thanks!", first["conversation_id"])
        self.assertEqual(first["conversation_id"], second["conversation_id"])


if __name__ == "__main__":
    unittest.main()

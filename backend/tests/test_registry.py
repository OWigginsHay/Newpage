import unittest

from app import registry


class RegistryTest(unittest.TestCase):
    def setUp(self):
        self._saved = dict(registry.TOOL_REGISTRY)

    def tearDown(self):
        registry.TOOL_REGISTRY.clear()
        registry.TOOL_REGISTRY.update(self._saved)

    def test_register_and_dispatch(self):
        @registry.tool
        def add(a: int, b: int) -> int:
            "Add two numbers."
            return a + b

        self.assertIn("add", registry.TOOL_REGISTRY)
        self.assertTrue(getattr(add, "__is_tool__", False))
        self.assertEqual(registry.dispatch("add", {"a": 2, "b": 3}), 5)

    def test_get_functions_returns_callables(self):
        @registry.tool
        def noop() -> None:
            "Do nothing."

        self.assertIn(noop, registry.get_functions())

    def test_unknown_tool_raises(self):
        with self.assertRaises(KeyError):
            registry.dispatch("does_not_exist", {})

    def test_duplicate_name_raises(self):
        @registry.tool
        def dup():  # noqa: ANN202
            "First."

        with self.assertRaises(ValueError):

            @registry.tool
            def dup():  # noqa: F811
                "Second, same name."


if __name__ == "__main__":
    unittest.main()

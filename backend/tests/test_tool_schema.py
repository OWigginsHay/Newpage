import unittest
from enum import Enum
from typing import Annotated, Optional

from pydantic import BaseModel

from app.tool_schema import function_schema, to_anthropic, to_openai


class Address(BaseModel):
    street: str
    postcode: int


class Color(Enum):
    RED = "red"
    BLUE = "blue"


def sample(
    name: Annotated[str, "the person's name"],
    age: int,
    tags: list[str],
    ratio: Optional[float] = None,
    address: Address = None,  # type: ignore[assignment]
    color: Color = Color.RED,
    limit: int = 10,
) -> dict:
    """Do a thing.

    This longer paragraph should be ignored in the tool description.
    """
    return {}


class ToolSchemaTest(unittest.TestCase):
    def setUp(self):
        self.schema = function_schema(sample)
        self.props = self.schema["parameters"]["properties"]

    def test_name_and_description(self):
        self.assertEqual(self.schema["name"], "sample")
        self.assertEqual(self.schema["description"], "Do a thing.")

    def test_primitive_types(self):
        self.assertEqual(self.props["name"], {"type": "string", "description": "the person's name"})
        self.assertEqual(self.props["age"], {"type": "integer"})

    def test_list_generic(self):
        self.assertEqual(self.props["tags"], {"type": "array", "items": {"type": "string"}})

    def test_optional_unwrapped(self):
        self.assertEqual(self.props["ratio"], {"type": "number"})

    def test_enum(self):
        self.assertEqual(self.props["color"], {"type": "string", "enum": ["red", "blue"]})

    def test_pydantic_model_expanded(self):
        address = self.props["address"]
        self.assertEqual(address.get("type"), "object")
        self.assertIn("street", address.get("properties", {}))
        self.assertIn("postcode", address.get("properties", {}))

    def test_required_only_params_without_defaults(self):
        self.assertEqual(self.schema["parameters"]["required"], ["name", "age", "tags"])

    def test_openai_envelope(self):
        env = to_openai(sample)
        self.assertEqual(env["type"], "function")
        self.assertEqual(env["function"], self.schema)

    def test_anthropic_envelope(self):
        env = to_anthropic(sample)
        self.assertEqual(env["name"], "sample")
        self.assertEqual(env["input_schema"], self.schema["parameters"])


if __name__ == "__main__":
    unittest.main()

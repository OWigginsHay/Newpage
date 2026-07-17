import * from tools.py 
import signature
import pydantic

def get_functions():
    ...

type_lookup = {
    int: "number",
    str: "string",
    dict: "object",
    list: "array"#...
}


def nest_type():
    if not pydanticbasemodel:
        for type in types:
            json_key = type_lookup[type]
            if type == dict or list:
                for nest in type.iter:
                    nest_type(nest)
    else:
        pydanticbasemodel.tojson()

def function_schema():
    args = signature.inspect(func)
    nest_type(args)
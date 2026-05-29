# Autor: Brandon
# Descripción: Ruta API que recibe expresiones booleanas, ejecuta lexer y parser, y devuelve JSON.

from flask import Blueprint, jsonify, request

from lexer.lexer import analyze_expression
from parser.parser_cfg import CFGParser
from utils.errors import LexerError, ParserError

validate_bp = Blueprint("validate_bp", __name__)


@validate_bp.route("/api/validate", methods=["POST"])
def validate_expression():
    data = request.get_json(silent=True) or {}
    expression = data.get("expression", "")

    if not expression or not expression.strip():
        return jsonify(_invalid_response("Error: la expresión no puede estar vacía."))

    try:
        tokens = analyze_expression(expression)
        parser = CFGParser(tokens)
        result = parser.parse()

        return jsonify(
            {
                "valid": result["valid"],
                "message": result["message"],
                "tokens": [token.to_dict() for token in tokens],
                "derivation": result["derivation"],
                "tree": result["tree"],
            }
        )

    except (LexerError, ParserError) as error:
        return jsonify(_invalid_response(str(error)))


def _invalid_response(message):
    return {
        "valid": False,
        "message": message,
        "tokens": [],
        "derivation": [],
        "tree": None,
    }

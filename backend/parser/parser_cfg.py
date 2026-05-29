# Autor: Jara
# Descripción: Parser CFG recursivo descendente que valida sintaxis, precedencia y construye el árbol sintáctico.

from parser.tree_builder import create_node
from utils.errors import ParserError


class CFGParser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.position = 0
        self.derivation = []
        self.previous_token = None

    def parse(self):
        if not self.tokens:
            raise ParserError("Error: la expresión está vacía.")

        tree = self.parse_exp()

        if self.current_token() is not None:
            token = self.current_token()
            if token.token in ("ID", "LPAREN", "NOT"):
                raise ParserError(f"Error: falta un operador antes de '{token.lexeme}'.")
            raise ParserError(f"Error: token inesperado '{token.lexeme}'.")

        return {
            "valid": True,
            "message": "Expresión válida",
            "derivation": self.derivation,
            "tree": tree,
        }

    def parse_exp(self):
        self.derivation.append("Exp -> Term ExpPrima")
        term_node = self.parse_term()
        exp_prima_node = self.parse_exp_prima()

        children = [term_node]
        if exp_prima_node:
            children.append(exp_prima_node)

        return create_node("Exp", children=children)

    def parse_exp_prima(self):
        token = self.current_token()

        if token and token.token == "OR":
            self.derivation.append("ExpPrima -> | Term ExpPrima")
            or_node = self.consume("OR")
            term_node = self.parse_term()
            next_exp_prima = self.parse_exp_prima()

            children = [or_node, term_node]
            if next_exp_prima:
                children.append(next_exp_prima)

            return create_node("ExpPrima", children=children)

        self.derivation.append("ExpPrima -> ε")
        return None

    def parse_term(self):
        self.derivation.append("Term -> Factor TermPrima")
        factor_node = self.parse_factor()
        term_prima_node = self.parse_term_prima()

        children = [factor_node]
        if term_prima_node:
            children.append(term_prima_node)

        return create_node("Term", children=children)

    def parse_term_prima(self):
        token = self.current_token()

        if token and token.token == "AND":
            self.derivation.append("TermPrima -> & Factor TermPrima")
            and_node = self.consume("AND")
            factor_node = self.parse_factor()
            next_term_prima = self.parse_term_prima()

            children = [and_node, factor_node]
            if next_term_prima:
                children.append(next_term_prima)

            return create_node("TermPrima", children=children)

        self.derivation.append("TermPrima -> ε")
        return None

    def parse_factor(self):
        token = self.current_token()

        if token is None:
            raise ParserError(self._message_for_missing_factor())

        if token.token == "NOT":
            production = "Factor -> ~ Factor" if token.lexeme == "~" else "Factor -> ! Factor"
            self.derivation.append(production)
            not_node = self.consume("NOT")
            factor_node = self.parse_factor()
            return create_node("Factor", children=[not_node, factor_node])

        if token.token == "LPAREN":
            self.derivation.append("Factor -> ( Exp )")
            left_parenthesis = self.consume("LPAREN")
            expression_node = self.parse_exp()
            right_parenthesis = self.consume("RPAREN")
            return create_node(
                "Factor",
                children=[left_parenthesis, expression_node, right_parenthesis],
            )

        if token.token == "ID":
            self.derivation.append("Factor -> id")
            identifier = self.consume("ID")
            return create_node("Factor", children=[identifier])

        if token.token == "OR":
            raise ParserError("Error: se esperaba un identificador antes del operador OR.")

        if token.token == "AND":
            raise ParserError(self._message_for_unexpected_and())

        if token.token == "RPAREN":
            raise ParserError("Error: se esperaba un identificador antes de ')'.")

        raise ParserError(f"Error: token inesperado '{token.lexeme}'.")

    def current_token(self):
        if self.position >= len(self.tokens):
            return None
        return self.tokens[self.position]

    def consume(self, expected_token):
        token = self.current_token()

        if token is None:
            if expected_token == "RPAREN":
                raise ParserError("Error: falta cerrar paréntesis ')'.")
            raise ParserError(f"Error: se esperaba {expected_token}, pero terminó la expresión.")

        if token.token != expected_token:
            if expected_token == "RPAREN":
                raise ParserError(f"Error: se esperaba ')' y se encontró '{token.lexeme}'.")
            raise ParserError(
                f"Error: se esperaba {expected_token} y se encontró '{token.lexeme}'."
            )

        self.position += 1
        self.previous_token = token
        return self._terminal_node(token)

    def _terminal_node(self, token):
        if token.token == "ID":
            return create_node("id", value=token.lexeme)

        return create_node(token.token, value=token.lexeme)

    def _message_for_missing_factor(self):
        if self.previous_token is None:
            return "Error: la expresión está vacía."

        if self.previous_token.token == "OR":
            return "Error: se esperaba un identificador después del operador OR."

        if self.previous_token.token == "AND":
            return "Error: se esperaba un identificador después del operador AND."

        if self.previous_token.token == "NOT":
            return "Error: se esperaba un identificador después del operador NOT."

        if self.previous_token.token == "LPAREN":
            return "Error: se esperaba una expresión después de '('."

        return "Error: la expresión terminó inesperadamente."

    def _message_for_unexpected_and(self):
        if self.previous_token and self.previous_token.token == "AND":
            return "Error: se esperaba un identificador después del operador AND."

        return "Error: se esperaba un identificador antes del operador AND."

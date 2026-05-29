# Autor: Marco
# Descripción: Analizador léxico encargado de convertir la expresión booleana en tokens y lexemas.

from models.token import Token
from utils.errors import LexerError


TOKEN_DESCRIPTIONS = {
    "ID": "Identificador",
    "OR": "Operador lógico OR",
    "AND": "Operador lógico AND",
    "NOT": "Operador lógico NOT",
    "LPAREN": "Paréntesis de apertura",
    "RPAREN": "Paréntesis de cierre",
}


class Lexer:
    def __init__(self, expression):
        self.expression = expression
        self.position = 0
        self.tokens = []

    def tokenize(self):
        while self.position < len(self.expression):
            current = self.expression[self.position]

            if current.isspace():
                self.position += 1
                continue

            if current == "|":
                self._add_token("OR", current)
                self.position += 1
                continue

            if current == "&":
                self._add_token("AND", current)
                self.position += 1
                continue

            if current in ("~", "!"):
                self._add_token("NOT", current)
                self.position += 1
                continue

            if current == "(":
                self._add_token("LPAREN", current)
                self.position += 1
                continue

            if current == ")":
                self._add_token("RPAREN", current)
                self.position += 1
                continue

            if current.islower():
                self.tokens.append(self._read_identifier())
                continue

            if current.isalpha():
                raise LexerError(
                    f"Error: los identificadores deben usar letras minúsculas. "
                    f"Se encontró '{current}' en la posición {self.position}."
                )

            if current.isdigit():
                raise LexerError(
                    f"Error: un identificador debe iniciar con una letra minúscula. "
                    f"Se encontró '{current}' en la posición {self.position}."
                )

            raise LexerError(
                f"Error: símbolo desconocido '{current}' en la posición {self.position}."
            )

        return self.tokens

    def _read_identifier(self):
        start = self.position

        while self.position < len(self.expression):
            current = self.expression[self.position]
            if not (current.islower() or current.isdigit()):
                break
            self.position += 1

        lexeme = self.expression[start:self.position]
        return Token("ID", lexeme, TOKEN_DESCRIPTIONS["ID"])

    def _add_token(self, token_type, lexeme):
        self.tokens.append(Token(token_type, lexeme, TOKEN_DESCRIPTIONS[token_type]))


def analyze_expression(expression):
    lexer = Lexer(expression)
    return lexer.tokenize()

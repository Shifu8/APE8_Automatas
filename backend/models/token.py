# Autor: Marco
# Descripción: Modelo de token usado para representar lexemas reconocidos por el analizador léxico.

from dataclasses import dataclass


@dataclass
class Token:
    token: str
    lexeme: str
    description: str

    def to_dict(self):
        return {
            "token": self.token,
            "lexeme": self.lexeme,
            "description": self.description,
        }

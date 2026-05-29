# Autor: Jara
# Descripción: Gramática Libre de Contexto usada para validar expresiones booleanas sin recursión izquierda.

GRAMMAR_TEXT = """
Exp -> Term ExpPrima
ExpPrima -> | Term ExpPrima | ε
Term -> Factor TermPrima
TermPrima -> & Factor TermPrima | ε
Factor -> ~ Factor | ! Factor | ( Exp ) | id
"""

PRODUCTIONS = [
    "Exp -> Term ExpPrima",
    "ExpPrima -> | Term ExpPrima",
    "ExpPrima -> ε",
    "Term -> Factor TermPrima",
    "TermPrima -> & Factor TermPrima",
    "TermPrima -> ε",
    "Factor -> ~ Factor",
    "Factor -> ! Factor",
    "Factor -> ( Exp )",
    "Factor -> id",
]

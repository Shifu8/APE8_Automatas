# Autor: Brandon
# Descripción: Errores personalizados para reportar problemas léxicos y sintácticos de forma clara.


class LexerError(Exception):
    """Error producido durante el análisis léxico."""


class ParserError(Exception):
    """Error producido durante el análisis sintáctico."""

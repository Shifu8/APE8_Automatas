# Validador de Expresiones Booleanas

Este proyecto permite validar expresiones booleanas mediante un análisis léxico y sintáctico basado en una Gramática Libre de Contexto (CFG). La aplicación recibe una expresión, identifica sus lexemas, clasifica sus tokens, valida la estructura sintáctica y muestra el resultado de forma visual.
El sistema respeta la precedencia de los operadores booleanos `NOT`, `AND` y `OR`, y presenta la derivación y el árbol sintáctico generado para facilitar la explicación del proceso.

## Qué hace el sistema

- Recibe una expresión booleana escrita por el usuario.
- Identifica lexemas y tokens.
- Valida si la estructura de la expresión cumple con la gramática.
- Aplica precedencia de operadores: `NOT > AND > OR`.
- Muestra la derivación producida por el parser.
- Genera un árbol sintáctico visual.
- Indica si la expresión es válida o inválida.

## Tecnologías usadas

- Python
- Flask
- Flask-CORS
- React
- Vite
- JavaScript
- CSS

## Estructura del proyecto

La carpeta `backend/` contiene la API en Flask y los módulos del analizador:

- `main.py`: crea la aplicación Flask, habilita CORS y registra las rutas.
- `routes/validate_route.py`: expone el endpoint `POST /api/validate`.
- `lexer/lexer.py`: convierte la expresión en tokens.
- `parser/parser_cfg.py`: valida la sintaxis con la CFG y construye la derivación.
- `parser/grammar.py`: documenta la gramática usada.
- `parser/tree_builder.py`: crea los nodos del árbol sintáctico.
- `models/token.py`: define la estructura de cada token.
- `utils/errors.py`: centraliza errores del lexer y parser.

La carpeta `frontend/` contiene la interfaz en React:

- `src/App.jsx`: organiza las secciones principales de la aplicación.
- `src/components/`: contiene los componentes de entrada, resultado, tokens, derivación y árbol.
- `src/services/api.js`: consume el endpoint del backend.
- `src/App.css`: define el diseño visual del frontend.
- `vite.config.js`: configura el servidor de desarrollo de Vite.

El archivo `requirements.txt` está en la raíz porque las dependencias de Python pertenecen al proyecto completo, no solo a una subcarpeta.

## Gramática utilizada

La gramática implementada separa los niveles `Exp`, `Term` y `Factor` para respetar la precedencia de los operadores booleanos.

```text
Exp -> Term ExpPrima
ExpPrima -> | Term ExpPrima | ε
Term -> Factor TermPrima
TermPrima -> & Factor TermPrima | ε
Factor -> ~ Factor | ! Factor | ( Exp ) | id
```

La gramática no es ambigua en esta implementación porque cada nivel controla una precedencia específica:

1. `NOT`: `~` o `!`
2. `AND`: `&`
3. `OR`: `|`

Esto permite que una expresión válida tenga una única interpretación sintáctica y un único árbol de derivación.

## Tokens principales

| Lexema | Token |
| --- | --- |
| `a1`, `a2`, `a3`, `variable1` | VARIABLE |
| `true`, `false` | BOOLEAN |
| `!` o `~` | NOT |
| `&` | AND |
| `|` | OR |
| `(` | LPAREN |
| `)` | RPAREN |

## Ejemplos válidos

```text
a1 | a2 & a3
~(a1 & a2)
!a1 | a2
true | false & true
```

## Ejemplo inválido

```text
a1 & & a2
```

En ese caso, el parser detecta que después del operador `AND` falta un identificador o valor lógico.

## Cómo ejecutar el proyecto

### Backend

Desde la raíz del proyecto:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python backend\main.py
```

El backend se ejecuta en:

```text
http://127.0.0.1:5000
```

Endpoint disponible:

```text
POST http://127.0.0.1:5000/api/validate
```

Ejemplo de cuerpo JSON:

```json
{
  "expression": "a1 | a2 & a3"
}
```

### Frontend

En otra terminal:

```powershell
cd frontend
npm install
npm run dev
```

El frontend se abre normalmente en:

```text
http://localhost:5173
```

## Flujo de uso

1. El usuario escribe una expresión booleana en la interfaz.
2. React envía la expresión al backend.
3. Flask recibe el texto y lo pasa al analizador léxico.
4. El lexer genera los tokens.
5. El parser valida la sintaxis usando la CFG.
6. La respuesta incluye estado de validación, tokens, derivación y árbol sintáctico.
7. El frontend muestra la información en tarjetas, tablas y una vista visual del árbol.

## Autores y responsabilidades

Marco:

- Analizador léxico.
- Archivos principales: `backend/lexer/lexer.py`, `backend/models/token.py`.

Jara:

- Parser CFG, derivación y árbol sintáctico.
- Archivos principales: `backend/parser/parser_cfg.py`, `backend/parser/grammar.py`, `backend/parser/tree_builder.py`.

Brandon:

- Backend Flask, rutas API y frontend React.
- Archivos principales: `backend/main.py`, `backend/routes/validate_route.py` y `frontend/`.

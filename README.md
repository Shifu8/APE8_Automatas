# Validador de Expresiones Booleanas con CFG

Validador léxico-sintáctico de expresiones booleanas. Escribís una expresión, el backend la tokeniza, la valida contra una CFG con precedencia `NOT > AND > OR`, y te devuelve la derivación + árbol sintáctico.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite |
| Backend | Python + Flask |
| Analizador | Lexer propio + Parser CFG descendente |

## Gramática

```
Exp      → Term ExpPrima
ExpPrima → | Term ExpPrima | ε
Term     → Factor TermPrima
TermPrima → & Factor TermPrima | ε
Factor   → ~ Factor | ! Factor | ( Exp ) | id
```

No ambigua. Cada operador en su nivel: `NOT` > `AND` > `OR`.

## Tokens

| Lexema | Token |
|--------|-------|
| `a1`, `x`, `variable1` | VARIABLE |
| `true`, `false` | BOOLEAN |
| `!` / `~` | NOT |
| `&` | AND |
| `\|` | OR |
| `(` | LPAREN |
| `)` | RPAREN |

## Ejemplos

**Válidas:** `a1 | a2 & a3`, `~(a1 & a2)`, `!a1 | a2`, `true | false & true`

**Inválida:** `a1 & & a2` (falta identificador tras AND)

## Cómo correrlo

### Backend (puerto 5000)

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python backend\main.py
```

### Frontend (puerto 5173)

```powershell
cd frontend
npm install
npm run dev
```

Mandale un POST a `http://127.0.0.1:5000/api/validate` con `{ "expression": "a1 | a2 & a3" }` y te responde con validación, tokens, derivación y árbol.

## Autores

| Persona | Se encargó de |
|---------|---------------|
| **Marco** | Lexer (`lexer/`, `models/`) |
| **Jara** | Parser, derivación y árbol (`parser/`) |
| **Brandon** | API Flask, rutas y frontend React |

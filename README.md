# Validador de Expresiones Booleanas con CFG

Validador léxico-sintáctico de expresiones booleanas. Escribes una expresión, el backend la tokeniza, la valida contra una CFG con precedencia `NOT > AND > OR`, y te devuelve la derivación + árbol sintáctico.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React  |
| Backend | Python + Flask |
| Analizador | Lexer propio + Parser CFG descendente |

## Gramática

```
Exp    → Exp | Term | Term
Term   → Term & Factor | Factor
Factor → ~ Factor | ! Factor | ( Exp ) | id

La gramática define la precedencia de operadores booleanos mediante su estructura jerárquica:

NOT > AND > OR

El análisis sintáctico utiliza derivación hacia la izquierda para generar la secuencia de producción y construir el árbol sintáctico correspondiente.
```

No ambigua. Cada operador en su nivel: `NOT` > `AND` > `OR`.

## Tokens

| Lexema | Token |
|--------|-------|
| `a1`, `x`, `variable1`, `true`, `false` | VARIABLE |
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


## Autores

| Persona | Se encargó de |
|---------|---------------|
| **Marco** | Lexer (`lexer/`, `models/`) |
| **Jara** | Parser, derivación y árbol (`parser/`) |
| **Brandon** | API Flask, rutas y frontend React |

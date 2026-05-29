<!-- Autor: Brandon -->
<!-- Descripción: Guía principal del proyecto cfg-boolean-validator con arquitectura, instalación y uso. -->

# cfg-boolean-validator

Sistema Cliente-Servidor para validar expresiones lógicas booleanas usando una Gramática Libre de Contexto (CFG). El proyecto incluye backend en Python con Flask y frontend en React con Vite.

La aplicación reconoce tokens, valida la sintaxis, respeta la precedencia de operadores y muestra el resultado con tabla de tokens, derivación paso a paso y árbol sintáctico visual.

## Arquitectura usada

```text
Frontend React + Vite
|
| HTTP / JSON
v
Backend Python + Flask
|
v
Lexer + Parser CFG + Árbol Sintáctico
```

No usa login, base de datos ni autenticación.

## Gramática utilizada

Gramática base:

```text
Exp -> Exp | Term | Term
Term -> Term & Factor | Factor
Factor -> ~ Factor | ! Factor | ( Exp ) | id
```

Versión implementada sin recursión izquierda:

```text
Exp -> Term ExpPrima
ExpPrima -> | Term ExpPrima | ε
Term -> Factor TermPrima
TermPrima -> & Factor TermPrima | ε
Factor -> ~ Factor | ! Factor | ( Exp ) | id
```

Precedencia respetada:

1. NOT: `~` o `!`
2. AND: `&`
3. OR: `|`

## Tabla de tokens y lexemas

| Token | Lexema | Descripción |
| ----- | ------ | ----------- |
| ID | `a1`, `a2`, `a3`, `variable1`, `true`, `false` | Identificador o valor lógico |
| OR | `|` | Operador lógico OR |
| AND | `&` | Operador lógico AND |
| NOT | `~` o `!` | Operador lógico NOT |
| LPAREN | `(` | Paréntesis de apertura |
| RPAREN | `)` | Paréntesis de cierre |

## Estructura del proyecto

```text
cfg-boolean-validator/
├── README.md
├── .gitignore
├── requirements.txt
├── backend/
│   ├── main.py
│   ├── routes/
│   │   └── validate_route.py
│   ├── lexer/
│   │   └── lexer.py
│   ├── parser/
│   │   ├── parser_cfg.py
│   │   ├── grammar.py
│   │   └── tree_builder.py
│   ├── models/
│   │   └── token.py
│   └── utils/
│       └── errors.py
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        ├── components/
        │   ├── Header.jsx
        │   ├── ExpressionForm.jsx
        │   ├── ResultCard.jsx
        │   ├── TokenTable.jsx
        │   ├── DerivationView.jsx
        │   └── TreeView.jsx
        └── services/
            └── api.js
```

## Instalación del backend

```bash
cd cfg-boolean-validator
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

Ejemplo de entrada:

```json
{
  "expression": "a1 | a2 & a3"
}
```

## Instalación del frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend se ejecuta normalmente en:

```text
http://localhost:5173
```

## Ejemplos válidos

```text
a1 | a2 & a3
~(a1 & a2)
!a1 | a2
true | false & true
(a1 | a2) & a3
~a1 & a2
```

## Ejemplos inválidos

```text
a1 |
a1 & & a2
(a1 | a2
| a1
a1 a2
a1 @ a2
```

## Autores y responsabilidades

Marco:

- Responsable del analizador léxico.
- Archivos principales: `backend/lexer/lexer.py`, `backend/models/token.py`.
- Identifica tokens y lexemas.

Jara:

- Responsable del parser CFG y validación sintáctica.
- Archivos principales: `backend/parser/parser_cfg.py`, `backend/parser/grammar.py`, `backend/parser/tree_builder.py`.
- Valida la expresión, respeta precedencia y construye el árbol sintáctico.

Brandon:

- Responsable del backend Flask, rutas API y frontend React.
- Archivos principales: `backend/main.py`, `backend/routes/validate_route.py` y todo el frontend React.
- Conecta frontend con backend y muestra resultados visuales.

## Descripción del funcionamiento

1. El usuario escribe una expresión booleana en el frontend.
2. React envía la expresión por HTTP al endpoint `POST /api/validate`.
3. Flask recibe el JSON y valida que la expresión no esté vacía.
4. El lexer recorre la cadena carácter por carácter, ignora espacios y genera tokens.
5. El parser recursivo descendente aplica la CFG sin recursión izquierda.
6. Si la expresión es válida, el backend devuelve tokens, derivación y árbol sintáctico.
7. Si la expresión es inválida, el backend devuelve un mensaje claro, tokens vacíos, derivación vacía y árbol nulo.
8. El frontend actualiza la tabla, la derivación y el árbol sintáctico visual en cada validación.

// Autor: Brandon
// Descripcion: Tabla de referencia y chips de tokens analizados.

const BOOLEAN_VALUES = new Set(["true", "false"]);

const TOKEN_REFERENCE = [
  { lexeme: "a1, a2, a3, variable1, true, false", token: "VARIABLE" },
  { lexeme: "|", token: "Operador lógico OR" },
  { lexeme: "&", token: "Operador lógico AND" },
  { lexeme: "~ o !", token: "Operador lógico NOT" },
  { lexeme: "(", token: "Paréntesis de apertura" },
  { lexeme: ")", token: "Paréntesis de cierre" },
];

function getTokenLabel(token) {
  if (token.token === "ID") {
    return BOOLEAN_VALUES.has(token.lexeme.toLowerCase()) ? "BOOLEAN" : "VARIABLE";
  }
  return token.token;
}

function TokenTable({ tokens }) {
  return (
    <article className="panel token-panel">
      <div className="panel-heading">
        <div>
          <h2>Tokens</h2>
          <p>Referencia de lexemas y tokens reconocidos por el analizador.</p>
        </div>
        <span className="panel-badge">{tokens.length}</span>
      </div>

      <div className="token-ref">
        <h3>Referencia</h3>
        <div className="ref-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lexema</th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_REFERENCE.map((item) => (
                <tr key={item.lexeme}>
                  <td><code className="lexeme-code">{item.lexeme}</code></td>
                  <td>{item.token}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="token-dynamic">
        <h3>Tokens de la expresión</h3>
        {tokens.length === 0 ? (
          <p className="empty-state token-empty">No hay tokens para mostrar.</p>
        ) : (
          <div className="token-flow">
            {tokens.map((token, index) => {
              const tokenLabel = getTokenLabel(token);
              return (
                <div key={`${token.token}-${token.lexeme}-${index}`} className="token-chip">
                  <span className={`token-chip-type token-${tokenLabel.toLowerCase()}`}>
                    {tokenLabel}
                  </span>
                  <code className="token-chip-lexeme">{token.lexeme}</code>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

export default TokenTable;

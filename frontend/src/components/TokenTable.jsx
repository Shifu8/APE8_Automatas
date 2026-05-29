// Autor: Brandon
// Descripcion: Tabla visual para mostrar lexemas y tokens normalizados.

const BOOLEAN_VALUES = new Set(["true", "false"]);

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
          <h2>Tabla de tokens</h2>
          <p>Lexemas reconocidos y clasificación del analizador.</p>
        </div>
        <span className="panel-badge">{tokens.length}</span>
      </div>

      {tokens.length === 0 ? (
        <p className="empty-state">No hay tokens para mostrar.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lexema</th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => {
                const tokenLabel = getTokenLabel(token);

                return (
                  <tr key={`${token.token}-${token.lexeme}-${index}`}>
                    <td>
                      <code className="lexeme-code">{token.lexeme}</code>
                    </td>
                    <td>
                      <span className={`token-pill token-${tokenLabel.toLowerCase()}`}>
                        {tokenLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}

export default TokenTable;

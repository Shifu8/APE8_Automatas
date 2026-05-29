// Autor: Brandon
// Descripcion: Componente principal de la interfaz para validar expresiones booleanas con CFG.

import { useState } from "react";
import Header from "./components/Header.jsx";
import ExpressionForm from "./components/ExpressionForm.jsx";
import TokenTable from "./components/TokenTable.jsx";
import DerivationView from "./components/DerivationView.jsx";
import TreeView from "./components/TreeView.jsx";
import { validateExpression } from "./services/api.js";

function App() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleValidate = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await validateExpression(expression);
      setResult(data);
    } catch (requestError) {
      setResult({
        valid: false,
        message:
          requestError.message ||
          "Error: no se pudo conectar con el backend Flask.",
        tokens: [],
        derivation: [],
        tree: null,
      });
      setError("Revisa que el backend esté ejecutándose en el puerto 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setExpression("");
    setResult(null);
    setError("");
  };

  const handleExampleClick = (example) => {
    setExpression(example);
    setResult(null);
    setError("");
  };

  const resultKey = loading
    ? "loading"
    : result
      ? `${result.valid}-${result.message}-${result.tokens?.length || 0}`
      : "empty";

  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">
        <div className="main-content">
          <section className="results-row" aria-label="Derivación y tokens">
            <DerivationView tree={result?.tree || null} />
            <TokenTable tokens={result?.tokens || []} />
          </section>

          <section className="bottom-row" aria-label="Árbol sintáctico">
            <TreeView tree={result?.tree || null} />
          </section>
        </div>

        <aside className="sidebar" aria-label="Entrada de expresión">
          <ExpressionForm
            expression={expression}
            loading={loading}
            onChange={setExpression}
            onClear={handleClear}
            onExampleClick={handleExampleClick}
            onValidate={handleValidate}
          />
          {result && (
            <div key={resultKey} className={`result-bar ${result.valid ? "valid" : "invalid"}`}>
              <span className="result-bar-icon">{result.valid ? "✓" : "✗"}</span>
              <span className="result-bar-text">
                {result.valid ? "Expresión válida" : "Expresión inválida"}
              </span>
              <span className="result-bar-msg">{result.message}</span>
              {error && <span className="result-bar-error">{error}</span>}
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;

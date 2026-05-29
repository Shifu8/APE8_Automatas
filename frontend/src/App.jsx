// Autor: Brandon
// Descripcion: Componente principal de la interfaz para validar expresiones booleanas con CFG.

import { useState } from "react";
import Header from "./components/Header.jsx";
import ExpressionForm from "./components/ExpressionForm.jsx";
import ResultCard from "./components/ResultCard.jsx";
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

  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">
        <section className="top-grid" aria-label="Formulario y resultado">
          <ExpressionForm
            expression={expression}
            loading={loading}
            onChange={setExpression}
            onClear={handleClear}
            onExampleClick={handleExampleClick}
            onValidate={handleValidate}
          />

          <ResultCard error={error} loading={loading} result={result} />
        </section>

        <section className="analysis-grid" aria-label="Análisis de expresión">
          <TokenTable tokens={result?.tokens || []} />
          <DerivationView derivation={result?.derivation || []} />
          <TreeView tree={result?.tree || null} />
        </section>
      </main>
    </div>
  );
}

export default App;

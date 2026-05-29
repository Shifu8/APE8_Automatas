// Autor: Brandon
// Descripcion: Tarjeta que muestra el estado valido o invalido del analisis.

function ResultCard({ error, loading, result }) {
  const statusClass = result?.valid ? "valid" : result ? "invalid" : "neutral";
  const title = result
    ? result.valid
      ? "Expresión válida"
      : "Expresión inválida"
    : "Sin validación";
  const badgeText = result ? (result.valid ? "Válida" : "Inválida") : "Pendiente";
  const resultKey = loading
    ? "loading"
    : result
      ? `${result.valid}-${result.message}-${result.tokens?.length || 0}`
      : "empty";

  return (
    <article className={`panel result-card ${statusClass}`}>
      <div className="panel-heading">
        <div>
          <h2>Resultado</h2>
          <p>Estado general del análisis léxico y sintáctico.</p>
        </div>
        <span className="panel-badge">{badgeText}</span>
      </div>

      <div className="result-state" key={resultKey}>
        <div className="status-dot" aria-hidden="true" />
        <div>
          <h3>{loading ? "Validando expresión" : title}</h3>
          <p>
            {loading
              ? "El backend está analizando tokens, derivación y árbol."
              : result?.message || "Aún no se ha validado ninguna expresión."}
          </p>
          {error && <p className="helper-error">{error}</p>}
        </div>
      </div>
    </article>
  );
}

export default ResultCard;

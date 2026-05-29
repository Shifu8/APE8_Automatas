// Autor: Brandon
// Descripcion: Vista numerada de los pasos de derivacion producidos por el parser CFG.

function DerivationView({ derivation }) {
  return (
    <article className="panel derivation-panel">
      <div className="panel-heading">
        <div>
          <h2>Derivación</h2>
          <p>Producciones aplicadas por el parser descendente.</p>
        </div>
        <span className="panel-badge">{derivation.length}</span>
      </div>

      {derivation.length === 0 ? (
        <p className="empty-state">No hay derivación disponible.</p>
      ) : (
        <div className="derivation-scroll">
          <ol className="derivation-list">
            {derivation.map((step, index) => (
              <li key={`${step}-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <code>{step}</code>
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}

export default DerivationView;

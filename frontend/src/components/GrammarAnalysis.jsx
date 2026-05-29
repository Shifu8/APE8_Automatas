// Autor: Brandon
// Descripcion: Tarjeta informativa sobre la gramatica usada por el analizador.

function GrammarAnalysis() {
  return (
    <article className="panel grammar-panel">
      <div className="panel-heading">
        <div>
          <h2>Análisis de la Gramática</h2>
          <p>Resumen formal de la CFG utilizada en el parser.</p>
        </div>
        <span className="panel-badge">CFG</span>
      </div>

      <div className="grammar-content">
        <div className="grammar-facts">
          <div className="grammar-fact">
            <span>Tipo de gramática</span>
            <strong>Gramática Libre de Contexto (CFG)</strong>
          </div>
          <div className="grammar-fact">
            <span>Precedencia implementada</span>
            <strong>NOT &gt; AND &gt; OR</strong>
          </div>
          <div className="grammar-fact">
            <span>Ambigüedad</span>
            <strong>No ambigua</strong>
          </div>
        </div>

        <div className="ambiguity-note">
          <p>
            La gramática implementada no es ambigua, ya que define explícitamente
            la precedencia y asociatividad de los operadores booleanos. Esto
            permite que cada expresión válida tenga una única interpretación
            sintáctica.
          </p>
        </div>
      </div>
    </article>
  );
}

export default GrammarAnalysis;

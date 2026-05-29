// Autor: Brandon
// Descripcion: Formulario para escribir, validar, limpiar y cargar ejemplos.

const QUICK_EXAMPLES = [
  "a1 | a2 & a3",
  "~(a1 & a2)",
  "!a1 | a2",
  "true | false & true",
  "a1 & & a2",
];

function ExpressionForm({
  expression,
  loading,
  onChange,
  onClear,
  onExampleClick,
  onValidate,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onValidate();
  };

  return (
    <form className="panel expression-form" onSubmit={handleSubmit}>
      <div className="panel-heading">
        <div>
          <h2>Entrada de expresión</h2>
          <p>Escribe una expresión booleana y valida su estructura CFG.</p>
        </div>
        <span className="panel-badge">CFG</span>
      </div>

      <div className="field-block">
        <label htmlFor="expression">Expresión booleana</label>
        <input
          id="expression"
          name="expression"
          placeholder="a1 | a2 & a3"
          type="text"
          value={expression}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>

      <div className="button-row">
        <button className="primary-button" disabled={loading} type="submit">
          {loading ? "Validando..." : "Validar expresión"}
        </button>
        <button
          className="secondary-button"
          disabled={loading}
          type="button"
          onClick={onClear}
        >
          Limpiar
        </button>
      </div>

      <div className="examples-block">
        <p>Ejemplos</p>
        <div className="examples" aria-label="Ejemplos rápidos">
          {QUICK_EXAMPLES.map((example) => (
            <button
              className="example-chip"
              key={example}
              type="button"
              onClick={() => onExampleClick(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}

export default ExpressionForm;

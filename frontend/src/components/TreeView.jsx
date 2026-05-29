// Autor: Brandon
// Descripcion: Componente recursivo que dibuja el arbol sintactico jerarquico.

const NON_TERMINALS = new Set(["Exp", "Term", "Factor", "ExpPrima", "TermPrima"]);
const BOOLEAN_VALUES = new Set(["true", "false"]);

function getTerminalLabel(node) {
  if (node.name === "id") {
    return BOOLEAN_VALUES.has(node.value?.toLowerCase()) ? "BOOLEAN" : "VARIABLE";
  }

  return node.name;
}

function getNodeClass(node, hasChildren) {
  if (NON_TERMINALS.has(node.name) || hasChildren) {
    return "non-terminal";
  }

  if (node.name === "id") {
    return BOOLEAN_VALUES.has(node.value?.toLowerCase()) ? "terminal boolean" : "terminal variable";
  }

  if (["AND", "OR", "NOT"].includes(node.name)) {
    return "terminal operator";
  }

  return "terminal symbol";
}

function TreeNode({ node }) {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const nodeClass = getNodeClass(node, hasChildren);
  const label = nodeClass.includes("non-terminal") ? node.name : getTerminalLabel(node);

  return (
    <li className={`tree-item ${hasChildren ? "has-children" : ""}`}>
      <div className={`tree-node ${nodeClass}`}>
        <span className="node-label">{label}</span>
        {node.value && <code className="node-lexeme">{node.value}</code>}
      </div>

      {hasChildren && (
        <ul className="tree-children">
          {node.children.map((child, index) => (
            <TreeNode key={`${child.name}-${child.value || "node"}-${index}`} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

function TreeView({ tree }) {
  return (
    <article className="panel tree-panel">
      <div className="panel-heading">
        <div>
          <h2>Árbol sintáctico</h2>
          <p>Estructura jerárquica generada por la gramática libre de contexto.</p>
        </div>
        <span className="panel-badge">{tree ? "Activo" : "Vacío"}</span>
      </div>

      {!tree ? (
        <p className="empty-state">No hay árbol sintáctico disponible.</p>
      ) : (
        <div className="tree-scroll">
          <div className="tree-legend" aria-label="Leyenda del árbol">
            <span className="legend-item legend-non-terminal">No terminal</span>
            <span className="legend-item legend-terminal">Terminal</span>
            <span className="legend-item legend-lexeme">Lexema</span>
          </div>
          <div className="tree-canvas">
            <ul className="tree-root">
              <TreeNode node={tree} />
            </ul>
          </div>
        </div>
      )}
    </article>
  );
}

export default TreeView;

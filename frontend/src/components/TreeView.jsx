// Autor: Brandon
// Descripcion: Vista didactica del arbol sintactico generado por la CFG.

const NON_TERMINALS = new Set(["Exp", "Term", "Factor"]);
const BOOLEAN_VALUES = new Set(["true", "false"]);
const OPERATORS = new Set(["AND", "OR", "NOT"]);
const SYMBOLS = new Set(["LPAREN", "RPAREN"]);

function terminalFrom(node) {
  if (!node) {
    return { name: "Vacío" };
  }

  if (node.name === "id") {
    const isBoolean = BOOLEAN_VALUES.has(node.value?.toLowerCase());
    return {
      name: isBoolean ? "BOOLEAN" : "VARIABLE",
      value: node.value,
    };
  }

  return {
    name: node.name,
    value: node.value,
  };
}

function collectExpParts(expNode) {
  if (!expNode?.children?.length) {
    return [];
  }

  const parts = [{ term: expNode.children?.[0] }];
  let expPrima = expNode.children?.find((child) => child.name === "ExpPrima");

  while (expPrima) {
    const [operator, term, nextExpPrima] = expPrima.children || [];
    parts.push({ operator, term });
    expPrima = nextExpPrima?.name === "ExpPrima" ? nextExpPrima : null;
  }

  return parts;
}

function collectTermParts(termNode) {
  if (!termNode?.children?.length) {
    return [];
  }

  const parts = [{ factor: termNode.children?.[0] }];
  let termPrima = termNode.children?.find((child) => child.name === "TermPrima");

  while (termPrima) {
    const [operator, factor, nextTermPrima] = termPrima.children || [];
    parts.push({ operator, factor });
    termPrima = nextTermPrima?.name === "TermPrima" ? nextTermPrima : null;
  }

  return parts;
}

function transformExp(expNode) {
  const parts = collectExpParts(expNode);

  if (parts.length === 0) {
    return { name: "Exp" };
  }

  let displayTree = {
    name: "Exp",
    children: [transformTerm(parts[0].term)],
  };

  for (let index = 1; index < parts.length; index += 1) {
    displayTree = {
      name: "Exp",
      children: [
        displayTree,
        terminalFrom(parts[index].operator),
        transformTerm(parts[index].term),
      ],
    };
  }

  return displayTree;
}

function transformTerm(termNode) {
  const parts = collectTermParts(termNode);

  if (parts.length === 0) {
    return { name: "Term" };
  }

  let displayTree = {
    name: "Term",
    children: [transformFactor(parts[0].factor)],
  };

  for (let index = 1; index < parts.length; index += 1) {
    displayTree = {
      name: "Term",
      children: [
        displayTree,
        terminalFrom(parts[index].operator),
        transformFactor(parts[index].factor),
      ],
    };
  }

  return displayTree;
}

function transformFactor(factorNode) {
  const children = factorNode.children || [];
  const [firstChild] = children;

  if (!firstChild) {
    return { name: "Factor" };
  }

  if (firstChild.name === "id") {
    return {
      name: "Factor",
      children: [terminalFrom(firstChild)],
    };
  }

  if (firstChild.name === "NOT") {
    return {
      name: "Factor",
      children: [terminalFrom(firstChild), transformFactor(children[1])],
    };
  }

  if (firstChild.name === "LPAREN") {
    return {
      name: "Factor",
      children: [
        { name: "LPAREN", value: "(" },
        transformExp(children[1]),
        { name: "RPAREN", value: ")" },
      ],
    };
  }

  return {
    name: "Factor",
    children: children.map(transformUnknownNode),
  };
}

function transformUnknownNode(node) {
  if (!node) {
    return { name: "Vacío" };
  }

  if (node.name === "Exp") {
    return transformExp(node);
  }

  if (node.name === "Term") {
    return transformTerm(node);
  }

  if (node.name === "Factor") {
    return transformFactor(node);
  }

  return terminalFrom(node);
}

function getNodeClass(node, hasChildren) {
  if (NON_TERMINALS.has(node.name) || hasChildren) {
    return "non-terminal";
  }

  if (node.name === "VARIABLE") {
    return "terminal variable";
  }

  if (node.name === "BOOLEAN") {
    return "terminal boolean";
  }

  if (OPERATORS.has(node.name)) {
    return "terminal operator";
  }

  if (SYMBOLS.has(node.name)) {
    return "terminal symbol";
  }

  return "terminal";
}

function TreeNode({ node }) {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const nodeClass = getNodeClass(node, hasChildren);

  return (
    <li className={`tree-item ${hasChildren ? "has-children" : ""}`}>
      <div className={`tree-node ${nodeClass}`}>
        <span className="node-label">{node.name}</span>
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
  const displayTree = tree ? transformExp(tree) : null;

  return (
    <article className="panel tree-panel">
      <div className="panel-heading tree-heading">
        <div>
          <h2>Árbol Sintáctico Generado</h2>
          <p>
            Vista organizada para leer la expresión por niveles: primero OR,
            después AND y finalmente los factores.
          </p>
        </div>
        <span className="panel-badge">{tree ? "Activo" : "Vacío"}</span>
      </div>

      {!displayTree ? (
        <p className="empty-state centered-empty">No hay árbol sintáctico disponible.</p>
      ) : (
        <div className="tree-scroll">
          <div className="tree-guide" aria-label="Guía de lectura del árbol">
            <span>
              <strong>Exp</strong> separa OR
            </span>
            <span>
              <strong>Term</strong> separa AND
            </span>
            <span>
              <strong>Factor</strong> contiene NOT o lexema
            </span>

          </div>

          <div className="tree-legend" aria-label="Leyenda del árbol">
            <span className="legend-item legend-non-terminal">No terminal</span>
            <span className="legend-item legend-terminal">Terminal</span>
            <span className="legend-item legend-lexeme">Lexema</span>
          </div>

          <div className="tree-canvas">
            <ul className="tree-root">
              <TreeNode node={displayTree} />
            </ul>
          </div>
        </div>
      )}
    </article>
  );
}

export default TreeView;

// Autor: Brandon
// Descripcion: Vista de derivacion izquierda construida desde el arbol sintactico.

function createTerminal(symbol, value) {
  return {
    symbol,
    value,
    terminal: true,
  };
}

function createNonTerminal(symbol, children) {
  return {
    symbol,
    children,
    terminal: false,
  };
}

function terminalFrom(node) {
  if (!node) {
    return createTerminal("Vacío", "Vacío");
  }

  if (node.name === "id") {
    return createTerminal("id", node.value);
  }

  return createTerminal(node.name, node.value || node.name);
}

function collectExpParts(expNode) {
  if (!expNode?.children?.length) {
    return [];
  }

  const parts = [{ term: expNode.children[0] }];
  let expPrima = expNode.children.find((child) => child.name === "ExpPrima");

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

  const parts = [{ factor: termNode.children[0] }];
  let termPrima = termNode.children.find((child) => child.name === "TermPrima");

  while (termPrima) {
    const [operator, factor, nextTermPrima] = termPrima.children || [];
    parts.push({ operator, factor });
    termPrima = nextTermPrima?.name === "TermPrima" ? nextTermPrima : null;
  }

  return parts;
}

function buildExp(parts) {
  if (parts.length === 0) {
    return createNonTerminal("Exp", []);
  }

  if (parts.length === 1) {
    return createNonTerminal("Exp", [buildTerm(collectTermParts(parts[0].term))]);
  }

  const previousParts = parts.slice(0, -1);
  const currentPart = parts[parts.length - 1];

  return createNonTerminal("Exp", [
    buildExp(previousParts),
    terminalFrom(currentPart.operator),
    buildTerm(collectTermParts(currentPart.term)),
  ]);
}

function buildTerm(parts) {
  if (parts.length === 0) {
    return createNonTerminal("Term", []);
  }

  if (parts.length === 1) {
    return createNonTerminal("Term", [buildFactor(parts[0].factor)]);
  }

  const previousParts = parts.slice(0, -1);
  const currentPart = parts[parts.length - 1];

  return createNonTerminal("Term", [
    buildTerm(previousParts),
    terminalFrom(currentPart.operator),
    buildFactor(currentPart.factor),
  ]);
}

function buildFactor(factorNode) {
  const children = factorNode?.children || [];
  const [firstChild] = children;

  if (!firstChild) {
    return createNonTerminal("Factor", []);
  }

  if (firstChild.name === "id") {
    return createNonTerminal("Factor", [terminalFrom(firstChild)]);
  }

  if (firstChild.name === "NOT") {
    return createNonTerminal("Factor", [
      terminalFrom(firstChild),
      buildFactor(children[1]),
    ]);
  }

  if (firstChild.name === "LPAREN") {
    return createNonTerminal("Factor", [
      terminalFrom(firstChild),
      buildExp(collectExpParts(children[1])),
      terminalFrom(children[2]),
    ]);
  }

  return createNonTerminal("Factor", children.map(terminalFrom));
}

function itemText(item) {
  return item.terminal ? item.value : item.symbol;
}

function formatSentence(items) {
  return items
    .map(itemText)
    .join(" ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")");
}

function buildRule(item) {
  const rightSide = item.children.length > 0
    ? item.children.map(itemText).join(" ")
    : "ε";

  return `${item.symbol} → ${rightSide}`;
}

function createLeftDerivation(tree) {
  if (!tree) {
    return [];
  }

  const root = buildExp(collectExpParts(tree));
  const steps = [{ sentence: "Exp", rule: "" }];
  let currentItems = [root];

  while (currentItems.some((item) => !item.terminal)) {
    const targetIndex = currentItems.findIndex((item) => !item.terminal);
    const target = currentItems[targetIndex];
    const nextItems = [
      ...currentItems.slice(0, targetIndex),
      ...target.children,
      ...currentItems.slice(targetIndex + 1),
    ];

    steps.push({
      sentence: formatSentence(nextItems),
      rule: buildRule(target),
    });

    currentItems = nextItems;
  }

  return steps;
}

function DerivationView({ tree }) {
  const steps = createLeftDerivation(tree);

  return (
    <article className="panel derivation-panel">
      <div className="panel-heading">
        <div>
          <h2>Derivación hacia la izquierda</h2>
          <p>En cada paso se expande siempre el no terminal más a la izquierda.</p>
        </div>
        <span className="panel-badge">{Math.max(steps.length - 1, 0)}</span>
      </div>

      {steps.length === 0 ? (
        <p className="empty-state">No hay derivación disponible.</p>
      ) : (
        <div className="derivation-scroll">
          <ol className="derivation-list left-derivation-list">
            {steps.map((step, index) => (
              <li key={`${step.sentence}-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div className="derivation-step">
                  <code className="derivation-expression">
                    {index === 0 ? step.sentence : `⇒ ${step.sentence}`}
                  </code>
                  {step.rule && (
                    <code className="derivation-rule">[{step.rule}]</code>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}

export default DerivationView;

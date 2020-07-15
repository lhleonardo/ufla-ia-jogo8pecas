
function heuristicSearch(board) {
  console.log("Heurística sendo invocada");
  const discover = [{ board, parent: null }]
  const visitedNodes = []

  let finishState = null;

  const isVisited = node => {
    const exists = visitedNodes.find(visited => visited.board.isEqual(node.board))
    return !!exists
  }

  const visit = node => {
    visitedNodes.push(node);
  }

  const findSmallerWeight = nodes => {
    let smaller = nodes[0];

    nodes.forEach(node => {
      if (node.board.weight < smaller.board.weight) {
        smaller = node;
      }
    })

    return smaller;
  }

  while (discover.length > 0) {
    const newNodes = [];

    while (discover.length > 0) {
      const element = discover.shift();


      if (element.board.isValid()) {
        newNodes.push(element);
        break;
      }

      if (!isVisited(element)) {
        visit(element);

        const nextSteps = element.board
          .nextStep()
          .filter(step => !isVisited(step))
          .map(step => ({ board: step, parent: element }));

        newNodes.push(...nextSteps);
      }
    }

    const smaller = findSmallerWeight(newNodes);

    if (smaller.board.isValid()) {
      finishState = smaller;
    } else {
      discover.push(...newNodes.filter(node => node.board.weight === smaller.board.weight));
    }
  }

  const path = [];

  let current = finishState;

  while (current !== null) {
    path.unshift(current.board);

    current = current.parent;
  }

  return path;
}

function hardSearch(board) {
  let current = { board, parent: null };

  const discover = [current];
  const visitedNodes = [];

  const isVisited = node => {
    return !!visitedNodes.find(visited => visited.board.isEqual(node));
  }

  while (discover.length > 0) {
    current = discover.shift();
    // marca o elemento
    visitedNodes.push(current);

    const nextSteps = current.board
      .nextStep()
      .filter(step => !isVisited(step))
      .map(step => ({ board: step, parent: current }));

    const hasValidStep = nextSteps
      .find(step => step.board.isValid());

    if (hasValidStep) {
      current = hasValidStep;
      break;
    }

    discover.push(...nextSteps);
  }

  const path = [];

  let iterator = current;

  while (iterator !== null) {
    path.unshift(iterator.board);

    iterator = iterator.parent;
  }

  return path;

}
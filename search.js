const startButton = document.getElementById('start');

startButton.addEventListener('click', event => {
  start();
});

function start() {
  const piecesContainer = document.querySelector('.pieces .dropzone');

  if (piecesContainer.childElementCount) {
    alert('Tabuleiro incompleto. Termine de configurá-lo');
    return;
  }

  const structure = extractData();
  const board = new Board(structure);

  console.log(board);

  const result = findSolution(board);
  // teste(board);

  console.log(result);
}

function teste(board) {
  const visitedBoards = [];
  const queue = [board];

  const visit = (board) => {
    const exists = visitedBoards.find(visited => visited.isEqual(board));

    if (!exists) {
      visitedBoards.push(board);
    }
  }

  for (let i = 0; i < 3; i++) {
    const newSteps = [];
    while (queue.length > 0) {
      const element = queue.shift();
      visitedBoards.push(element);

      newSteps.push(...element.nextStep());
    }
    queue.push(...newSteps);
  }

  queue.splice(0, queue.length);
  queue.push(board);
  console.log(visitedBoards);
  for (let i = 0; i < 3; i++) {
    const newSteps = [];
    while (queue.length > 0) {
      const element = queue.shift();
      visit(element);

      newSteps.push(...element.nextStep());
    }
    queue.push(...newSteps);
  }
  console.log(visitedBoards);
}

function extractData() {
  const extractValue = (row, column) => {
    const piece = document
      .querySelector(`.row[data-index="${row}"] .column[data-index="${column}"] .piece`);

    return piece;
  }

  const result = {};

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let value = extractValue(i, j);

      if (value) {
        result[value.innerHTML] = { row: i, column: j };
      } else {
        result["-1"] = { row: i, column: j };
      }
    }
  }

  return result;
}

// function bigHeadSearch(board) {

//   var minQueue = [];
//   var queue = [];

//   var current = { ancestor: null, board }

//   var manhattanBoard = board;
//   // var menor = manhattanBoard;

//   while (!current.board.isValid()) {
//     //Retorna todas as possibilidades de movimento do board
//     queue = current.board.nextStep();

//     let menor = queue[0];

//     //Verifica o elemento de menor valor retornado pelo nextStep e o insere na fila de menor custo
//     queue.forEach(element => {
//       if (element.weight <= menor.weight) {
//         menor = element;
//       }
//     });

//     queue = queue.filter(element => element.weight === menor.weight)

//     minQueue.push(menor);
//     manhattanBoard = menor;
//     queue = [];

//   }

//   return minQueue;
// }

function findSolution(board) {

  let discover = [{ board, parent: null }]

  let valid = null;

  const visitedNodes = []

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
          .map(step => ({ board: step, parent: element }));

        newNodes.push(...nextSteps);
      }
    }

    const smaller = findSmallerWeight(newNodes);

    if (smaller.board.isValid()) {
      valid = discover[0];
    } else {
      discover.push(...newNodes.filter(node => node.board.weight === smaller.board.weight));
    }
  }

  const history = [];

  while (valid) {
    history.push(valid);

    valid = valid.parent;
  }

  console.log(valid);
  return history;
}

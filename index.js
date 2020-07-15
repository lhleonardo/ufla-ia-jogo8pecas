const startHardSearch = document.getElementById('start-hard');
const startHeuristicSearch = document.getElementById('start-heuristic');

const nextButton = document.getElementById('next');
const previousButton = document.getElementById('previous');

const backButton = document.getElementById('back');

startHardSearch.addEventListener('click', () => start(hardSearch));
startHeuristicSearch.addEventListener('click', () => start(heuristicSearch));

nextButton.addEventListener('click', nextStep);
previousButton.addEventListener('click', previousStep);

backButton.addEventListener('click', back);

const historyBoards = [];
var step = 0;

function getDistanceBetweenElements(a, b) {
  const calculateDistance = (element) => {
    const { top, left, width, height } = element.getBoundingClientRect();
    return {
      x: left + width / 2,
      y: top + height / 2
    };
  }

  const aPosition = calculateDistance(a);
  const bPosition = calculateDistance(b);

  return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
}

function extractValue(row, column) {
  const piece = document
    .querySelector(`.row[data-index="${row}"] .column[data-index="${column}"] .piece`);

  return piece;
}

function extractData() {
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


function back() {
  document.querySelector(".content").classList.remove('result-mode');
  document.getElementById('mode').text = "Modo de entrada";

  historyBoards.clear();
  step = 0;

  document.getElementById('progress').innerHTML = "";

  previousButton.disabled = true;

  if (step === historyBoards.length) {
    nextButton.disabled = true;
  }


}

function start(searchMethod) {
  const piecesContainer = document.querySelector('.pieces .dropzone');

  if (piecesContainer.childElementCount) {
    swal("Entrada inválida", "O tabuleiro foi mal preenchido. Confira!", "error");
    return;
  }

  const structure = extractData();
  const board = new Board(structure);

  try {
    const result = searchMethod(board);
    console.log(result);
    showResults(result);
  } catch (error) {
    swal("Oops", "Solução muito extensa para ser encontrada com esses métodos!", "warning");
    console.error(error);
  }
}


function changedPieces(board, updatedBoard) {
  const isEqual = (a, b) => {
    return a.row === b.row && a.column === b.column;
  }

  for (i = 1; i <= 8; i++) {
    const element = board.state[i];
    const nextElement = updatedBoard.state[i];

    if (!isEqual(element, nextElement)) {
      return {
        piece: i,
        oldPosition: { ...element },
        newPosition: { ...nextElement }
      }
    }

  }
}

function showResults(steps) {
  document.querySelector(".content").classList.add('result-mode');
  document.getElementById('mode').text = "Modo passo a passo";

  historyBoards.push(...steps);

  document.getElementById('progress').innerHTML = `${step + 1}/${historyBoards.length}`;


  previousButton.disabled = true;

  if (step === historyBoards.length) {
    nextButton.disabled = true;
  }
}

function configureButtons() {
  if (step === historyBoards.length - 1) {
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
  }

  if (step === 0) {
    previousButton.disabled = true;
  } else {
    previousButton.disabled = false;
  }
}

function nextStep() {
  modifyBoard(step, step + 1);
  step++;

  document.getElementById('progress').innerHTML = `${step + 1}/${historyBoards.length}`;
  configureButtons();
}

function previousStep() {
  modifyBoard(step, step - 1);

  step--;

  document.getElementById('progress').innerHTML = `${step + 1}/${historyBoards.length}`;
  configureButtons();
}

function modifyBoard(current, next) {
  const emptyElement = document.querySelector(".column:empty")
  const piece = changedPieces(historyBoards[current], historyBoards[next]);

  const { oldPosition, newPosition } = piece;

  const oldElement = extractValue(oldPosition.row, oldPosition.column);
  const distance = getDistanceBetweenElements(oldElement, emptyElement);

  if (oldPosition.column === newPosition.column) { // sobe ou desce
    if (newPosition.row > oldPosition.row) { // descer
      oldElement.style.setProperty('--distance', `${distance}px`);
    } else { // subir
      oldElement.style.setProperty('--distance', `-${distance}px`);
    }
    oldElement.classList.add('move-vertical');
  } else { // deverá subir ou descer
    if (newPosition.column > oldPosition.column) { // direita
      oldElement.style.setProperty('--distance', `${distance}px`);
    } else { // esquerda
      oldElement.style.setProperty('--distance', `-${distance}px`);
    }
    oldElement.classList.add('move-horizontal');
  }

  oldElement.addEventListener('transitionend', (event) => {
    const current = event.target;

    const newParent = document.querySelector(".column:empty")

    if (current.classList.contains('move-horizontal')
      || current.classList.contains('move-vertical')) {

      // apaga do antigo pai
      current.parentElement.innerHTML = "";

      // define novo filho
      newParent.appendChild(current);

      if (current.classList.contains('move-horizontal')) {
        current.classList.remove('move-horizontal');
      } else {
        current.classList.remove('move-vertical');
      }
    }
  })
}
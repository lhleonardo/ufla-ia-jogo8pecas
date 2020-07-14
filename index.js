const startButton = document.getElementById('start');

startButton.addEventListener('click', start)

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

function start() {
  const piecesContainer = document.querySelector('.pieces .dropzone');

  if (piecesContainer.childElementCount) {
    alert('Tabuleiro incompleto. Termine de configurá-lo');
    return;
  }

  const structure = extractData();
  const board = new Board(structure);

  try {
    const result = heuristicSearch(board);
    console.log(result);
  } catch (error) {
    alert("Não foi possível encontrar resultado!");
    console.error(error);
  }
}
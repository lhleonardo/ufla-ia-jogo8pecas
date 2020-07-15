const piecesContainer = document.querySelector('.pieces .dropzone');

const pieces = document.querySelectorAll('.piece');
const columns = document.querySelectorAll('.board .row .column');

const resetButton = document.getElementById('reset');

pieces.forEach(piece => {
  piece.addEventListener('dragstart', dragstart);
  piece.addEventListener('dragend', dragend);
})

function dragstart() {
  this.classList.add('is-grabbing');

  this.parentElement.classList.add('old-parent');

  columns.forEach(column => column.classList.add('highlight'));
  piecesContainer.classList.add('highlight');
}

function dragend() {
  this.classList.remove('is-grabbing');

  columns.forEach(column => column.classList.remove('highlight'));
  piecesContainer.classList.remove('highlight');

  const parentElement = document.querySelector('.old-parent');

  if (parentElement && parentElement !== piecesContainer) {
    parentElement.innerHTML = "";
    parentElement.classList.remove('old-parent');
  }

  if (this.parentElement.childElementCount > 1) {
    const [element] = this.parentElement.children;

    piecesContainer.appendChild(element);
    this.removeChild(element);
  }

}

columns.forEach(column => {
  column.addEventListener('dragenter', dragenter);
  column.addEventListener('dragover', dragover);
  column.addEventListener('dragleave', dragleave);
  column.addEventListener('drop', drop);
})

function dragenter() {
  this.classList.add('is-over');
}

function dragover() {
  const piece = document.querySelector('.is-grabbing');
  this.appendChild(piece);
}

function dragleave() {
  this.classList.remove('is-over');
}

function drop() {
  this.classList.remove('is-over');
}

piecesContainer.addEventListener('dragenter', dragenter);
piecesContainer.addEventListener('dragover', dragover);
piecesContainer.addEventListener('dragleave', dragleave);
piecesContainer.addEventListener('drop', drop);

resetButton.addEventListener('click', () => {
  columns.forEach(column => {
    if (column.childElementCount) {
      const [element] = column.children;

      column.innerHTML = "";
      piecesContainer.appendChild(element);
    }
  })
})


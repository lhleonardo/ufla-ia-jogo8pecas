const correctBoard = new Board({
  1: { row: 0, column: 0 },
  2: { row: 0, column: 1 },
  3: { row: 0, column: 2 },
  4: { row: 1, column: 2 },
  5: { row: 2, column: 2 },
  6: { row: 2, column: 1 },
  7: { row: 2, column: 0 },
  8: { row: 1, column: 0 },
  '-1': { row: 1, column: 1 }
});

console.log(`board is correct? ${correctBoard.isValid() ? 'yes' : 'no'}`);

const invalidBoard = new Board({
  1: { row: 0, column: 0 },
  2: { row: 0, column: 2 },
  3: { row: 1, column: 0 },
  4: { row: 1, column: 2 },
  5: { row: 2, column: 0 },
  6: { row: 2, column: 1 },
  7: { row: 0, column: 1 },
  8: { row: 2, column: 2 },
  '-1': { row: 1, column: 1 }
});

console.log(`Board is invalid? ${invalidBoard.isValid() ? 'no' : 'yes'}. Weight: ${invalidBoard.weight()}`);
console.log(invalidBoard.state);
console.log('Next steps');
console.log(invalidBoard.nextStep());
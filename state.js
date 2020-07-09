const CORRECT_MATCH = {
    1: { row: 0, column: 0 },
    2: { row: 0, column: 1 },
    3: { row: 0, column: 2 },
    4: { row: 1, column: 2 },
    5: { row: 2, column: 2 },
    6: { row: 2, column: 1 },
    7: { row: 2, column: 0 },
    8: { row: 1, column: 0 },
    '-1': { row: 1, column: 1 }
};
/**
* 
* Board
* 
* Objeto com todos os oito elementos, tendo informações
* de sua localização a partir de uma linha (row) e uma
* coluna (column).
* 
* A classe é capaz de gerar os próximos movimentos e 
* calcular o peso de custo até a solução final
* 
*/

const comparePieces = (x, y) => {
    return x.row === y.row && x.column === y.column;
}

class Board {

    constructor(values) {
        // this.state = {
        //     1: { row: 0, column: 0 },
        //     2: { row: 0, column: 1 },
        //     3: { row: 0, column: 2 },
        //     4: { row: 0, column: 0 },
        //     5: { row: 0, column: 0 },
        //     6: { row: 0, column: 0 },
        //     7: { row: 0, column: 0 },
        //     8: { row: 0, column: 0 },
        //     '-1': { row: 0, column: 0 }
        // }

        this.state = values;
    }

    weight() {
        let result = 0;

        const pieces = Object.keys(this.state);

        const positiveDifference = (x, y) => {
            if (x > y) return x - y;
            return y - x;
        }

        pieces.forEach(piece => {
            // não está na posição correta
            const currentLocation = this.state[piece];
            const correctLocation = CORRECT_MATCH[piece];

            // não deverá calcular distância para o elemento em branco
            if (currentLocation === this.state['-1']) return;

            // se não está na posição correta, calcula a distância que está da real posição
            if (currentLocation !== correctLocation) {
                let rowDifference = positiveDifference(currentLocation.row, correctLocation.row);
                let columnDifference = positiveDifference(currentLocation.column, correctLocation.column);

                result += rowDifference + columnDifference;
            }
        })

        return result;
    }

    nextStep() {
        const nextValues = [];

        const elements = Object.keys(this.state);

        elements.forEach(index => {
            const element = this.state[index];

            // não deve fazer nada para o espaço em branco
            if (this.state[index] === this.state['-1']) return;

            // novo elemento que sofrerá movimentação
            const newElement = { ...element };
            // localização do atual estado em branco
            const blankSpace = { ... this.state['-1'] };

            // verificações para encontrar as combinações,
            // gerando novo local para espaço em branco e newElement,
            // movimentando a peça
            if ((element.row == blankSpace.row - 1) && (element.column == blankSpace.column)) {
                newElement.row = newElement.row + 1;
                blankSpace.row -= 1;
            }
            else if ((element.row == blankSpace.row + 1) && (element.column == blankSpace.column)) {
                newElement.row = newElement.row - 1;
                blankSpace.row += 1;
            }
            else if ((element.row == blankSpace.row) && (element.column == blankSpace.column - 1)) {
                newElement.column = newElement.column + 1;
                blankSpace.column -= 1;
            }
            else if ((element.row == blankSpace.row) && (element.column == blankSpace.column + 1)) {
                newElement.column = newElement.column - 1;
                blankSpace.column += 1;
            }

            if (element.row !== newElement.row || element.column !== newElement.column) {
                nextValues.push(new Board({ ...this.state, [index]: newElement, "-1": blankSpace }))
            }
        });

        return nextValues;

    }

    isValid() {
        const pieces = Object.keys(this.state);

        const invalidPiece = pieces.find(index => {
            const current = this.state[index];
            const correct = CORRECT_MATCH[index];

            if (current.row === correct.row && current.column === correct.column) {
                return false;
            }

            return true;
        });

        if (invalidPiece) {
            return false;
        }

        return true;
    }


    print() {
        const result = {
            0: { 0: null, 1: null, 2: null },
            1: { 0: null, 1: null, 2: null },
            2: { 0: null, 1: null, 2: null },
        };

        const keys = Object.keys(this.state);

        keys.forEach(key => {
            const element = this.state[key];

            result[element.row][element.column] = key;
        });

        return result;
    }
}
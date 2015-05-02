import { Grid, Cell } from './grid';

const BLACK = Symbol('BLACK');
const WHITE = Symbol('WHITE');

export const color = { BLACK, WHITE };

export class Board extends Grid {
  constructor(args={}) {
    let size = args.size || 19;
    let childType = args.childType || Space;

    super({size, childType});

    this.prisoners = {
      [color.WHITE]: 0,
      [color.BLACK]: 0
    };

    this.turns = [];
    this.positions = new Set();
  }

  printBoard(invalid=null) {
    var cols = 'ABCDEFGHJKLMNOPQRST';
    var boardString = '\n   ';
    for (let i=0; i<this.colN; i++) {
      boardString += `${cols[i]} `;
    }
    boardString += '\n';

    var rowNum = 0;
    for (let row of this.rows) {
      var rowString = `${rowNum+=1} |`;

      for (let col of row) {
        if (col.color === color.WHITE) {
          rowString += 'w|';

        } else if (col.color === color.BLACK) {
          rowString += 'b|';

        } else {
          rowString += '_|';
        }
      }
      rowString += '\n';
      boardString += rowString;
    }
    // TODO -- incorporate ko rules
    if (invalid) {
      console.log(`[${cols[invalid.col]} ${invalid.row}] is an invalid move:`);
    }
    console.log(boardString);
  }

  compress(mock=false) {
    var output = '';
    this.forEachCell((space)=>{
      let spaceColor = (mock ? space._mockColor : space.color) || space.color;

      if (spaceColor === color.WHITE) {
        output += 'w';
      } else if (spaceColor === color.BLACK) {
        output += 'b';
      } else {
        output += '0';
      }
    });
    return output;
  }

  logTurn() {
    let compressed = this.compress();
    this.turns.push(compressed);
    this.positions.add(compressed);

    return compressed;
  }

  placeStone(space, color, mock=false) {
    space = this._checkSpace(space);

    if (!space || !this.legalMove(space, color, mock)) return false;

    space.updateColor(color);
    space.updateNeighbors();
    this.logTurn();
    return space;
  }

  get currentTurn() {
    return this.turns.length;
  }

  _checkSpace(space) {
    if (space instanceof Array && space.length === 2) {
      return this[space[0]][space[1]];
    } else if (space instanceof Space) {
      return space;
    } else {
      return false
    }
  }

  legalMove(space, color, mock) {
    if (!color) {
      console.log('There is no color here...');
      return false;
    }
    // If there is already a stone on the space.
    if (space.color) {
      console.log(`There is already a ${space.color.toString()} stone on space ${this.id}`);
      return false;
    }

    if(!mock && this._detectKo(space, color)) {
      console.log(`You can\'t play at ${this.row}, ${this.col} because of ko`);
      // this.printBoard(); 
      return false;
    }

    for (let neighbor of space.neighbors) {
      // valid if any neighbors are empty.
      if (!neighbor.color) {
        return true;
      }
      // valid if any neighbors are the same color AND are not in atari.
      let sameColor = neighbor.color === color;
      if (sameColor && neighbor.liberties > 1) {
        return true;
      }
      // valid if at least one neighboring enemy is in atari.
      if (!sameColor && neighbor.liberties <= 1) {
        return true;
      }
    }

    // this.board.printBoard(this.coords);
    return false;
  }

// TODO - incorporate better simulated board.
  _detectKo(space, color) {
    let mock = true;
    this.placeStone(space, color, mock)
    let newPosition = this.compress(mock)

    return this.positions.has(newPosition);
  }
}

export class Space extends Cell {
  constructor(args={}) {
    super(args);
    this.board = args.grid;
    this.color = null;
    this.coords = {row: this.row, col: this.col};

    this._shape = {};
  }

  kill(mock=false) {
    this.color = null;
    this._updateShape(null, this.board.currentTurn, mock);
  }

  get shape() {
    return this._shape.latest;
  }

  get liberties() {
    return (
      this._shape.latest &&
      this._shape.latest.liberties.size
    ) || null;
  }

  get _mockLiberties() {
    return (
      this._shape.mock.latest &&
      this._shape.mock.latest.liberties.size
    ) || null;
  }

  updateColor(color, mock) {
    if (!mock) {
      this.color = color;
    } else {
      this._mockColor = color
    }
  }

  updateNeighbors(mock=false) {
    this._updateSiblings(mock);
    this._updateEnemies(mock);
  }

  _updateSiblings(mock=false) {
    var turn = this.board.currentTurn;
    var queue = [this];
    var shape = {
      liberties: new Set(),
      members: new Set()
    };

    while (queue.length) {
      let stone = queue.pop();
      let sameColor = mock ? 
        stone.color === this._mockColor :
        stone.color === this.color;

      if (!stone._shape[turn] && sameColor) {
        shape.liberties.extend(stone._immediateLiberties());
        shape.members.add(stone);

        stone._updateShape(shape, turn, mock);

        queue = queue.concat(stone.neighbors);
      }
    }
  }

  _updateShape(shape, turn, mock=false) {
    if (mock) {
      this._shape.mock[turn] = this._shape.mock.latest = shape;
    } else {
      this._shape[turn] = this._shape.latest = shape;
    }
  }

  _updateEnemies(mock=false) {
    var turn = this.board.currentTurn;
    this.neighbors.forEach((neighbor) => {
      if (neighbor.color !== this.color) {
        neighbor._updateSiblings(mock);

        if ((!mock && !neighbor.liberties) ||
            ( mock && !neighbor._mockLiberties)
        ) {
          this._takePrisoner(neighbor, mock);
        }
      }
    });
  }

  _takePrisoner(neighbor, mock=false) {
    for (let enemy of neighbor.shape.members) {
      enemy.kill(mock);
      if (!mock) { this.board.prisoners[this.color] += 1; }
    }
  }

  _immediateLiberties() {
    var liberties = new Set();
    for (let neighbor of this.neighbors) {
      if (!neighbor.color) liberties.add(neighbor);
    }
    return liberties;
  }
}

Set.prototype.union = function(...otherSets) {
  let newSet = new Set(this);
  for (let otherSet of otherSets) {
    for (let s of otherSet) {
      newSet.add(s);
    }
  }
  return newSet;
};

Set.prototype.extend = function(...otherSets) {
  for (let otherSet of otherSets) {
    for (let s of otherSet) {
      this.add(s);
    }
  }
  return this;
};

function log(...args) {
  console.log(...args);
}
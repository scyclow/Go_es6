import { Grid, Cell } from './grid';

const BLACK = Symbol('BLACK');
const WHITE = Symbol('WHITE');

export const color = { BLACK, WHITE };

export class Board extends Grid {
  constructor(args={}) {
    let size = args.size || 19;
    let childType = args.childType || Space;

    super({size, childType});

    this.turns = [];
    this.positions = new Set();

    this.game = args.game || {};
    this.prisoners = this.game.prisoners || 
      { [color.WHITE]: 0, [color.BLACK]: 0 };

    if (args.shadow) {
      this.shadow = true;

    } else {
      args.shadow = true;
      this.shadowBoard = new Board(args);
    }
  }

  printBoard(invalid=null) {
    var cols = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
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

  compress() {
    var output = '';
    this.forEachCell((space)=>{
      if (space.color === color.WHITE) {
        output += 'w';
      } else if (space.color === color.BLACK) {
        output += 'b';
      } else {
        output += '0';
      }
    });
    return output;
  }

  decompress(hash) {
    if (!this.shadow) {
      console.log('Can only decompress for shadow board.');
      return;
    }
    if (hash.length !== this.size * this.size) {
      console.log('Hash is the incorrect length.');
      return;
    }

    this.forEachCell((space)=>{
      let i = space.id;
      if (hash[i] === 'w') {
        space.color = color.WHITE;
      } else if (hash[i] === 'b') {
        space.color = color.BLACK;
      } else if (hash[i] === '0') {
        space.color = null;
      } else {
        console.log(`Unrecognized symbol at [${i}]`);
        this.forEachCell(c => c.color = null);
        return;
      }
    });
  }

  logTurn() {
    if (this.shadow) return;

    let compressed = this.compress();
    this.turns.push(compressed);
    this.positions.add(compressed);

    return compressed;
  }

  placeStone(space, color) {
    space = this._checkSpace(space);

    if (!space || !this.legalMove(space, color)) return false;

    space.updateColor(color);
    space.updateNeighbors();
    this.logTurn();

    return space;
  }

  get currentTurn() {
    return this.turns.length;
  }

  addPrisoner(color) {
    this.prisoners[color] += 1;
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

  legalMove(space, color) {
    if (this.shadow) return true;

    if (!color) {
      console.log('There is no color here...');
      return false;
    }
    // If there is already a stone on the space.
    if (space.color) {
      console.log(`There is already a ${space.color.toString()} stone on space ${this.id}`);
      return false;
    }

    if(this._detectKo(space, color)) {
      console.log(`You can\'t play at ${space.row}, ${space.col} because of ko`);
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

    return false;
  }

  _detectKo(space, color) {
    if (this.shadow) { return; }

    let shadow = this.shadowBoard;
    let currentBoard = this.compress();

    shadow.decompress(currentBoard);
    shadow.placeStone([space.row, space.col], color);

    let proposedBoard = shadow.compress();
    return this.positions.has(proposedBoard);
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

  kill() {
    this.color = null;
    this._shape = {};
  }

  get shape() {
    return this._shape;
  }

  get liberties() {
    let shape = this._shape;
    return (
      shape.liberties && shape.liberties.size
    ) || 0;
  }

  updateColor(color) {
    this.color = color;
  }

  updateNeighbors() {
    this._updateSiblings();
    this._updateEnemies();
  }

  _updateSiblings() {
    var queue = [this];
    var visited = new Set();
    var shape = {
      liberties: new Set(),
      members: new Set()
    };


    while (queue.length) {
      let stone = queue.pop();
      let sameColor = stone.color === this.color;

      if (!visited.has(stone.id) && sameColor) {
        shape.liberties.extend(stone._immediateLiberties());
        shape.members.add(stone);
        stone._updateShape(shape);

        visited.add(stone.id);
        queue = queue.concat(stone.neighbors);
      }
    }
  }

  _updateShape(shape) {
    this._shape = shape;
  }

  _updateEnemies() {
    this.neighbors.forEach((neighbor) => {
      if (neighbor.color !== this.color) {
        neighbor._updateSiblings();

        if (!neighbor.liberties) {
          this._takePrisoner(neighbor);
        }
      }
    });
  }

  _takePrisoner(neighbor) {
    for (let enemy of neighbor.shape.members) {
      enemy.kill();
      this.board.addPrisoner(this.color);
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
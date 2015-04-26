import { Grid, Cell } from './grid';

const BLACK = Symbol('BLACK');
const WHITE = Symbol('WHITE');

export const color = { BLACK, WHITE };

export class Board extends Grid {
  constructor(args={}) {
    let size = args.size || 19;
    let childType = args.childType || Space;

    super({size, childType});

    this.currentTurn = 0;
  }

  printBoard() {
    var cols = 'abcdefghjklmnopqrst'.split('');
    var boardString = '\n   ';
    for (let i=0; i<this.colN; i++) {
      boardString += `${cols[i]} `
    }
    boardString += '\n';

    var rowNum = 0;
    for (let row of this.rows) {
      var rowString = `${rowNum+=1} |`;

      for (let col of row) {
        if (col.color === color.WHITE) {
          rowString += 'w|'

        } else if (col.color === color.BLACK) {
          rowString += 'b|'

        } else {
          rowString += '_|'
        }
      }

      rowString += '\n';
      boardString += rowString
    }

    console.log(boardString);
  }
}

export class Space extends Cell {
  constructor(args={}) {
    super(args);
    this.board = args.grid;
    this.color = null;

    this._shape = {};
  }

  placeStone(color) {
    if (this.color) {
      throw `There is already a ${this.color.toString()} stone on this space`;
    }

    this.color = color;
    this.board.currentTurn += 1;
    this.updateNeighbors(this.board.currentTurn);
    return this;
  }

  killStone() {
    this.color = null;
    this._updateShape(null, this.board.currentTurn);
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

  updateNeighbors() {
    this._updateSiblings();
    this._updateEnemies();
  }

  _updateSiblings() {
    var turn = this.board.currentTurn;
    var queue = [this];
    var shape = {
      liberties: new Set(),
      members: new Set()
    };

    while (queue.length) {
      let stone = queue.pop();
      let sameColor = stone.color === this.color;

      if (!stone._shape[turn] && sameColor) {
        shape.liberties.extend(stone._immediateLiberties());
        shape.members.add(stone);

        stone._updateShape(shape, turn);

        queue = queue.concat(stone.neighbors);
      }
    }
  }

  _updateShape(shape, turn) {
    this._shape[turn] = this._shape.latest = shape;
  }

  _updateEnemies() {
    var turn = this.board.currentTurn;
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
    // TODO -- set prisoners on player, not space
    this._prisoners = this._prisoners || 0;
    for (let member of neighbor.shape.members) {
      member.killStone();
      this._prisoners += 1;
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
  return newSet
}

Set.prototype.extend = function(...otherSets) {
  for (let otherSet of otherSets) {
    for (let s of otherSet) {
      this.add(s);
    }
  }
  return this;
}

function log(...args) {
  console.log(...args);
}
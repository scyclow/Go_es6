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
}

export class Space extends Cell {
  constructor(args={}) {
    super(args);
    this.board = args.grid;
    this.color = null;

    this._liberties = {};
  }

  placeStone(color) {
    this.color = color;
    this.board.currentTurn += 1;
    this.updateNeighbors(this.board.currentTurn);
    return this;
  }

  killStone() {
    this.color = null;
  }

  get liberties() {
    return this._liberties.latest
  }

  updateNeighbors() {
    this._updateSiblings();
    this._updateEnemies();
  }

  _updateSiblings() {
    var turn = this.board.currentTurn;
    var queue = [this];
    var liberties = new Set();

    while (queue.length) {
      let stone = queue.pop();
      let sameColor = stone.color === this.color;

      if (!stone._liberties[turn] && sameColor) {
        liberties.extend(stone._immediateLiberties());
        stone._liberties[turn] = stone._liberties.latest = liberties;
        queue = queue.concat(stone.neighbors);
      }
    }
  }

  _updateEnemies() {
    var turn = this.board.currentTurn;
    this.neighbors.forEach((neighbor) => {
      if (neighbor.color !== this.color) {
        neighbor._updateSiblings();
      }
    });
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
export class Grid {
  constructor(args={}) {
    this.rowN = args.rows || args.size || 1;
    this.colN = args.cols || args.size || 1;
    this.size = args.size;
    this._rows = [];
    this._cols = [];
    this.childType = args.childType || Cell;

    var id = 0;
    for (let r=0; r<this.rowN; r++) {
      this[r] = this._rows[r] = [];

      for (let c=0; c<this.colN; c++) {
        if(!r) this._cols[c] = [];

        this[r][c] = this._cols[c][r] =
          new this.childType({
            row: r, col: c, grid: this, id: id
          });
        id += 1;
      }
    }

    Grid.count += 1;
  }

  get rows() {
    return this._rows;
  }

  get cols() {
    return this._cols;
  }

  [Symbol.iterator]() {
    this._curIx = 0;
    return this;
  }

  next() {
    if (this._curIx < this.rowN) {
      this._curIx += 1;
      return { value: this[this._curIx-1] };
    } else {
      return { done: true };
    }
  }

  forEachCell(fn) {
    for (let row of this) {
      for (let cell of row) {
        fn(cell);
      }
    }
  }
}

Grid.count = 0;

export class Cell {
  constructor(args={}) {
    this.row = args.row;
    this.col = args.col;
    this.id = args.id;
    this.grid = args.grid;
  }

  get neighbors() {
    this._neighbors = this._neighbors || [
        [this.row+1, this.col],
        [this.row-1, this.col],
        [this.row, this.col+1],
        [this.row, this.col-1]
      ].map(
        ([r, c]) => this.grid[r] && this.grid[r][c]
      ).filter( n => n );
    return this._neighbors;
  }
}


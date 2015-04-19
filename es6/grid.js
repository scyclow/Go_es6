export class Grid {
  constructor(args={}) {
    this.rowN = args.rows || 0;
    this.colN = args.cols || 0;
    this.cellType = args.cellType || Object;

    for (let r=0; r<this.rowN; r++) {
      this[r] = [];

      for(let c=0; c<this.colN; c++) {
        this[r][c] = new this.cellType({
          row: r, col: c, parent: this
        });
      }
    }

    Grid.count += 1;
  }
};

Grid.count = 0;

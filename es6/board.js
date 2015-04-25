import { Grid, Cell } from './grid';

export class Board extends Grid {
  constructor(args={}) {
    let size = args.size || 19;
    let childType = args.childType || Space;

    super({size, childType});
  }
}

export class Space extends Cell {
  constructor(args={}) {
    let board = args.board

    super({
      grid: board,
      row: args.row,
      col: args.col
    });

    this.board = board;
  }
}
import { Board, Space } from '../board';

describe('Board', function() {
  describe('constructor', () => {
    var size, board;

    beforeEach(()=>{
      size = 6
      board = new Board({size});
    });

    it('should have a size', () => {
      expect(board.rows.length).toBe(size);
      expect(board.size).toBe(size);
    });

    it('should have a Space as its default childType', function() {
      expect(board.childType).toEqual(Space);
    });
  });
});

describe('Space', function() {
  describe('constructor', () => {
    it('should have a row, col, and board', () => {
      let row = 1;
      let col = 1;
      let board = new Board;

      let space = new Space({row, col, board});
      expect(space.row).toEqual(row);
      expect(space.col).toEqual(col);
      expect(space.board).toEqual(board);
    });
  });
});

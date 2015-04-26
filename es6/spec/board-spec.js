import { Board, Space, color } from '../board';

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
      expect(board[3][3] instanceof Space).toBe(true);
    });
  });
});

describe('Space', function() {
  describe('constructor', () => {
    it('should have a row, col, and board', () => {
      let row = 1;
      let col = 1;
      let board = new Board;

      let space = new Space({row, col, grid: board});
      expect(space.row).toEqual(row);
      expect(space.col).toEqual(col);
      expect(space.board).toEqual(board);

      expect(space.color).toBe(null);
    });
  });

  describe('placeStone', ()=>{
    var board, space;

    beforeEach(()=>{
      board = new Board({size: 5});
      space = board[1][1];
    });

    it('should change the space\'s color', ()=>{
      expect(space.color).toBe(null);
      space.placeStone(color.BLACK);
      expect(space.color).toBe(color.BLACK);
    });
  });

  describe('get shape', function() {
    describe('liberties', ()=>{
      var board, stone1, stone2, stone3;

      beforeEach(()=>{
        // [w,_,w,_,_,_,_,_,_]
        // [_,_,_,w,_,_,_,_,_]
        board = new Board({size: 9});
        stone1 = board[0][0].placeStone(color.WHITE);
        stone2 = board[0][2].placeStone(color.WHITE);
        stone3 = board[1][3].placeStone(color.WHITE);
      });

      it('should return the correct number of liberties for edge spaces', ()=>{
        expect(stone1.shape.liberties.size).toBe(2);
        expect(stone2.shape.liberties.size).toBe(3);
        expect(stone3.shape.liberties.size).toBe(4);
      });

      it('should return the correct number of liberties of the shape', ()=>{
        let stone4 = board[0][1].placeStone(color.WHITE);
        let stone5 = board[1][0].placeStone(color.WHITE);

        // [w,w,w,_,_,_,_,_,_]
        // [w,_,_,w,_,_,_,_,_]
        // [_,_,_,_,_,_,_,_,_]
        let expectedLiberties = 4;
        expect(stone1.shape.liberties.size).toEqual(expectedLiberties);
        expect(stone2.shape.liberties.size).toEqual(expectedLiberties);
        expect(stone4.shape.liberties.size).toEqual(expectedLiberties);
        expect(stone5.shape.liberties.size).toEqual(expectedLiberties);
      });

      it('should return the correct number of liberties after a stone of the opposite color is placed', ()=>{
        // [w,b,w,_,_,_,_,_,_]
        // [_,_,_,w,_,_,_,_,_]
        var stoneShit = board[0][1].placeStone(color.BLACK);

        expect(stone1.shape.liberties.size).toBe(1);
        expect(stone2.shape.liberties.size).toBe(2);
      });

      it('get liberties should be a shorthand for shape.liberties.size', ()=>{
        expect(stone3.liberties).toBe(4);
      });
    });

    describe('members', function() {
      it('should return a set of all stones included in its shape', ()=>{
        let board = new Board({size: 9});
        let expectShapeSize = 5;
        for (let i=0; i<expectShapeSize; i++) {
          board[i][0].placeStone(color.WHITE);
          board[i][1].placeStone(color.BLACK);
        }

        for (let i=0; i<expectShapeSize; i++) {
          expect(board[i][0].shape.members instanceof Set).toBe(true);
          expect(board[i][0].shape.members.size).toEqual(expectShapeSize);
        }
      });
    });
  });

  describe('killStone', ()=>{
    var board;

    beforeEach(()=>{
      board = new Board({size: 9});
    });

    it('should set its color to null', ()=>{
      let space = board[1][1];
      space.placeStone(color.BLACK);
      expect(space.color).toBe(color.BLACK);

      space.killStone();
      expect(space.color).toBe(null);
    });

    it('should set the stone\'s shape to null', ()=>{
      let space = board[1][1];
      space.placeStone(color.BLACK);

      expect(space.liberties).toBe(4);
      space.killStone();

      expect(space.shape).toBe(null);
      expect(space.liberties).toBe(null);
    });

    it('should kill an entire shape', ()=>{
      let shapeSize = 5;
      for (let i=0; i<shapeSize; i++) {
        board[i][0].placeStone(color.WHITE);
        board[i][1].placeStone(color.BLACK);
      }
      board[shapeSize][0].placeStone(color.BLACK);

      for (let i=0; i<shapeSize; i++) {
        expect(board[i][0].color).toBe(null);
      }
    });
  });
});

describe('Set.prototype.union', function() {
  it('should combine two sets',()=>{
    let set1 = new Set([1,1,2,3,4]);
    let set2 = new Set([4,5,6,6]);
    let newSet = set1.union(set2);
    expect(newSet instanceof Set).toBe(true);
    expect(newSet.size).toEqual(6);
  });

  it('should several sets',()=>{
    let set1 = new Set([1]);
    let set2 = new Set([4]);
    let set3 = new Set(['stuff']);
    let newSet = set1.union(set2, set3);
    expect(newSet.has(1)).toBe(true);
    expect(newSet.has(4)).toBe(true);
    expect(newSet.has('stuff')).toBe(true);
  });

  it('should create a copy of the set if no arguments are passed', ()=>{
    let set1 = new Set([1,2,3]);
    let newSet = set1.union();
    newSet.add(4);
    expect(set1.size).toEqual(3);
    expect(newSet.size).toEqual(4);
  });
});

describe('Set.prototype.extend', function() {
  it('should create a copy of the set if no arguments are passed', ()=>{
    let set1 = new Set([1,2,3]);
    let set2 = new Set([4,5,6]);
    set1.extend(set2);

    expect(set1.size).toEqual(6);
    expect(set2.size).toEqual(3);
  });
});

function log(...args) {
  console.log(...args);
}
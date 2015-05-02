import { Board, Space, color } from '../board';

describe('Board', function() {
  describe('constructor', function() {
    var size, board;

    beforeEach(()=>{
      size = 6;
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

  describe('compress', function() {
    it('should return a hashed version of the board', ()=>{
      // [w,_,b,_,_,b,_,b,_]
      // [_,w,b,_,_,w,_,b,_]
      // [_,_,w,_,_,b,_,b,_]
      // [_,_,b,w,_,w,_,b,_]
      // [_,_,b,_,w,b,_,b,_]
      // [_,_,b,_,_,w,_,b,_]
      // [w,w,w,w,w,w,w,b,_]
      // [_,_,_,_,_,_,_,w,_]
      // [_,_,_,_,_,_,_,_,w]
      let board = new Board({size: 9});

      [[0,0], [1,1], [2,2], [3,3], [4,4],
       [5,5], [6,6], [7,7], [8,8], [6,0],
       [6,1], [6,2], [6,3], [6,4], [6,5],
       [1,5], [3,5]].forEach(
        coord => board.placeStone(coord, color.WHITE)
      );

      [[0,2], [5,2], [0,7], [1,7], [2,7],
       [1,2], [4,2], [5,7], [4,7], [3,7],
       [3,2], [4,5], [6,7], [0,5], [2,5]].forEach(
        coord => board.placeStone(coord, color.BLACK)
      );

      expect(board.compress()).toEqual(
        'w0b00b0b00wb00w0b000w00b0b000bw0w0b000b0wb0b000b00w0b0wwwwwwwb00000000w000000000w'
      );
    });
  });

  describe('logTurn', function() {
    it('should keep an ordered array and set of the board\'s history', ()=>{
      let board = new Board({size: 3});
      let firstPosition = 'b00000000';
      let secondPosition = 'b0w000000';

      board.placeStone(board[0][0], color.BLACK);

      expect(board.turns.length).toEqual(1);
      expect(board.positions.size).toEqual(1);
      expect(board.turns[0]).toEqual(firstPosition);
      expect(board.positions.has(firstPosition)).toBe(true);
      expect(board.positions.has(secondPosition)).toBe(false);

      board.placeStone(board[0][2], color.WHITE);

      expect(board.turns.length).toEqual(2);
      expect(board.positions.size).toEqual(2);
      expect(board.turns[1]).toEqual(secondPosition);
      expect(board.positions.has(secondPosition)).toBe(true);
    });
  });

  describe('placeStone', function() {
    it('should accept a coordinate or a space, and a color', function() {
      let board = new Board({size: 5});
      let space = board[1][1];

      let placeStoneSpace = board.placeStone(space, color.BLACK);
      expect(placeStoneSpace instanceof Space).toBe(true);

      let placeStoneCoord = board.placeStone([2,2], color.BLACK);
      expect(placeStoneCoord instanceof Space).toBe(true);
    });

    it('should change the space\'s color', ()=>{
      let board = new Board({size: 5});
      let space = board[1][1];

      expect(space.color).toBe(null);
      board.placeStone(space, color.BLACK);
      expect(space.color).toBe(color.BLACK);
    });

    describe('prevents illegal moves', function() {
      var board;

      beforeEach(()=>{
        board = new Board({size: 9});
      });

      it('when a stone has already been played in that space', ()=>{
        let originalColor = color.WHITE;
        board.placeStone([0, 0], originalColor);
        expect(board.placeStone([0, 0], color.WHITE)).toBe(false);
        expect(board.placeStone([0, 0], color.BLACK)).toBe(false);
        expect(board[0][0].color).toBe(originalColor);
      });

      it('checks to see if move is legal', ()=>{
        let space = board[0][0];
        let expectedColor = color.BLACK;
        spyOn(board, 'legalMove');

        board.placeStone(space, expectedColor);
        expect(board.legalMove).toHaveBeenCalledWith(space, expectedColor);
      });
    });

    describe('legalMove', function() {
      var board;

      beforeEach(()=>{
        board = new Board({size: 9});
      });

      it('when all neighbors are enemies, and none are in atari', ()=>{
        [[0, 1], [1, 0], [1, 2], [2, 1]].forEach(
          coord => board.placeStone(coord, color.WHITE)
        );

        expect(board.legalMove(board[1][1], color.BLACK)).toBe(false);
        expect(board.placeStone([1, 1], color.BLACK)).toBe(false);
        expect(board[1][1].color).toBe(null);
      });

      it('when it would kill its own shape', ()=>{
        [[1,0], [1,1], [1,2], [1,3], [0,4]].forEach(
          coord => board.placeStone(coord, color.BLACK)
        );

        [[0,3], [0,2], [0,1]].forEach(
          coord => board.placeStone(coord, color.WHITE)
        );
        // [_,w,w,w,b,_,_,_,_]
        // [b,b,b,b,_,_,_,_,_]
        expect(board.legalMove(board[0][0], color.WHITE)).toBe(false);
        expect(board.placeStone([0, 0], color.WHITE)).toBe(false);
        expect(board[0][0].color).toBe(null);
      });

      it('...but not when at least one of its neighbors is in atari', ()=>{
        [[1,0], [0,1]].forEach(coord => board.placeStone(coord, color.BLACK));
        [[0,2], [1,1]].forEach(coord => board.placeStone(coord, color.WHITE));
        // [_,b,w,_,_,_,_,_,_]
        // [b,w,_,_,_,_,_,_,_]
        expect(board.legalMove(board[0][0], color.WHITE)).toBe(true);
        board.placeStone([0, 0], color.WHITE);
        expect(board[0][0].color).toBe(color.WHITE);
      });

      // describe('ko', function() {
      //   it('simple ko:', ()=>{
      //     // [_,_,w,b,_]
      //     // [_,w,_,w,b]
      //     // [_,_,w,b,_]
      //     // [_,_,_,_,_]
      //     // [_,_,_,_,_]
      //     let board = new Board({size: 5});

      //     [[0,3], [1,4], [2,3]].forEach(
      //       (coord) => board.placeStone(coord, color.BLACK)
      //     );
      //     board.placeStone([0, 2], color.WHITE);
      //     board.placeStone([1, 1], color.WHITE);
      //     board.placeStone([2, 2], color.WHITE);
      //     board.placeStone([1, 3], color.WHITE);

      //     board.placeStone([1,2], color.BLACK);

      //     board.printBoard();
      //     // let newStone = board[1][3].placeStone(color.WHITE);
      //     // expect(newStone).toBe(false);
      //     // expect(board[1][3].color).toBe(null);

      //     expect(board[1][3]._detectKo(color.WHITE)).toBe(true)
      //   });

      // });
    });

    describe('capturing another shape', function() {
      var board;

      beforeEach(()=>{
        board = new Board({size: 9});
      });

      it('correctly keeps score of how many stones a color has captured', ()=>{
        [[1,0], [1,1], [1,2], [1,3], [0,4]].forEach(
          coord => board.placeStone(coord, color.BLACK)
        );

        let whiteStones = [[0,3], [0,2], [0,1]];
        whiteStones.forEach(
          coord => board.placeStone(coord, color.WHITE)
        );
        // [_,w,w,w,b,_,_,_,_]
        // [b,b,b,b,_,_,_,_,_]
        expect(board.prisoners[color.BLACK]).toBe(0);
        board.placeStone([0,0], color.BLACK);

        whiteStones.forEach((coord)=>{
          expect(board[coord[0]][coord[1]].color).toBe(null);
        });

        expect(board.prisoners[color.BLACK]).toBe(whiteStones.length);
      });
    });
  });

  describe('get currentTurn', function() {
    it('should return the current turn number', ()=>{
      let board = new Board({size: 9});
      expect(board.currentTurn).toEqual(0);

      let turns = [[0,0], [1,1], [2,2], [3,3]];
      turns.forEach(coord => board.placeStone(coord, color.BLACK));
      expect(board.currentTurn).toEqual(turns.length);
    });
  });
});

describe('Space', function() {
  describe('constructor', function() {
    it('should have a row, col, and board', () => {
      let row = 1;
      let col = 1;
      let board = new Board();

      let space = new Space({row, col, grid: board});
      expect(space.row).toEqual(row);
      expect(space.col).toEqual(col);
      expect(space.board).toEqual(board);

      expect(space.color).toBe(null);
    });
  });

  describe('get shape', function() {
    describe('liberties', ()=>{
      var board, stone1, stone2, stone3;

      beforeEach(()=>{
        // [w,_,w,_,_,_,_,_,_]
        // [_,_,_,w,_,_,_,_,_]
        board = new Board({size: 9});
        stone1 = board.placeStone([0, 0], color.WHITE);
        stone2 = board.placeStone([0, 2], color.WHITE);
        stone3 = board.placeStone([1, 3], color.WHITE);
      });

      it('should return the correct number of liberties for edge spaces', ()=>{
        expect(stone1.shape.liberties.size).toBe(2);
        expect(stone2.shape.liberties.size).toBe(3);
        expect(stone3.shape.liberties.size).toBe(4);
      });

      it('should return the correct number of liberties of the shape', ()=>{
        let stone4 = board.placeStone([0, 1], color.WHITE);
        let stone5 = board.placeStone([1, 0], color.WHITE);

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
        var stoneShit = board.placeStone([0, 1], color.BLACK);

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
          board.placeStone([i, 0], color.WHITE);
          board.placeStone([i, 1], color.BLACK);
        }

        for (let i=0; i<expectShapeSize; i++) {
          expect(board[i][0].shape.members instanceof Set).toBe(true);
          expect(board[i][0].shape.members.size).toEqual(expectShapeSize);
        }
      });
    });
  });

  describe('kill', function() {
    var board;

    beforeEach(()=>{
      board = new Board({size: 9});
    });

    it('should set its color to null', ()=>{
      let space = board[1][1];
      board.placeStone(space, color.BLACK);
      expect(space.color).toBe(color.BLACK);

      space.kill();
      expect(space.color).toBe(null);
    });

    it('should set the stone\'s shape to null', ()=>{
      let space = board[1][1];
      board.placeStone(space, color.BLACK);

      expect(space.liberties).toBe(4);
      space.kill();

      expect(space.shape).toBe(null);
      expect(space.liberties).toBe(null);
    });

    it('should kill an entire shape', ()=>{
      let shapeSize = 5;
      for (let i=0; i<shapeSize; i++) {
        board.placeStone([i, 0], color.WHITE);
        board.placeStone([i, 1], color.BLACK);
      }
      board.placeStone([shapeSize, 0], color.BLACK);

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
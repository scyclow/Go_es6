import { Grid } from '../grid';

describe('Grid', function() {
  var args = {
    rows: 19,
    cols: 9
  };

  describe('constructor', function() {
    it('should keep track of all grids', ()=>{
      let originalCount = Grid.count;
      let grid = new Grid();
      expect(Grid.count).toBe(originalCount + 1);
    });

    it('should initialize with the correct rows/columns properties', ()=>{
      let grid = new Grid(args);
      expect(grid.rowN).toEqual(args.rows);
      expect(grid.colN).toEqual(args.cols);
    });

    it('should initialize with the correct number of rows/columns', ()=>{
      let grid = new Grid(args);
      for (let i=0; i<args.rows; i++) {
        expect(grid[i]).toEqual(jasmine.any(Array));
        expect(grid[i].length).toEqual(args.cols)
      }
    });

    it('should initialize with empty objects as cells by default', ()=>{
      let grid = new Grid(args);
      for (let i=0; i<args.rows; i++) {
        for (let j=0; j<args.cols; j++) {
          expect(grid[i][j]).toEqual(jasmine.any(Object));
        }
      }
    });

    it('should initialize with the correct cellType, if given', ()=>{
      args.cellType = Array;
      let grid = new Grid(args);
      for (let i=0; i<args.rows; i++) {
        for (let j=0; j<args.cols; j++) {
          expect(grid[i][j]).toEqual(jasmine.any(args.cellType));
        }
      }
    });

    it('should pass the row index, col index, and itself to the new cellType', ()=>{
      args = {
        rows: 1,
        cols: 1,
        cellType: jasmine.createSpy('cellType')
      };
      let grid = new Grid(args);
      let expectedArgs = { row: 0, col: 0, parent: grid };

      expect(args.cellType).toHaveBeenCalledWith(expectedArgs);
    });
  });
});


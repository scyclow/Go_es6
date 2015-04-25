import { Grid, Cell } from '../grid';

describe('Grid', function() {
  describe('constructor', function() {
    var args;

    beforeEach(()=>{
      args = {
        rows: 19,
        cols: 9
      }
    });

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
      let expectedArgs = { row: 0, col: 0, grid: grid };

      expect(args.cellType).toHaveBeenCalledWith(expectedArgs);
    });
  });

  describe('rows', function() {
    var args, grid;

    beforeEach(()=>{
      args = {cols: 5, rows: 5}
      grid = new Grid(args);
    });

    it('should get properly', ()=>{
      expect(grid.rows.length).toEqual(args.rows);

      for (let row of grid.rows) {
        expect(row).toEqual(jasmine.any(Array));
        expect(row.length).toEqual(args.cols);
      }
    });
  });

  describe('cols', function() {
    var args, grid;

    beforeEach(()=>{
      args = {cols: 5, rows: 5}
      args.cellType = Object;
      grid = new Grid(args);
    });

    it('should be the proper size', ()=>{
      expect(grid.cols.length).toEqual(args.cols);

      for (let col of grid.cols) {
        expect(col).toEqual(jasmine.any(Array));
        expect(col.length).toEqual(args.rows);
      }
    });

    it('should map to the correct value', ()=>{
      const expRow = 0;
      const expCol = 3;

      let expValue = grid[expRow][expCol].someProperty = 'some property';
      expect(grid.cols[expCol][expRow].someProperty).toEqual(expValue);

      let expValue2 = grid[expRow][expCol].someProperty = 'some new property';
      expect(grid.cols[expCol][expRow].someProperty).toEqual(expValue2);

    });
  });

  describe('iteration', function() {
    var grid, size;

    beforeEach(()=>{
      size = 3;
      grid = new Grid({size});
    });

    it('should iterate over the rows', ()=>{
      var i = 0;
      for (let row of grid) {
        expect(row).toEqual(grid.rows[i])
        i += 1; 
      }

      expect(i).toEqual(size);
    });
  });

  describe('forEachCell', function() {
    var grid;

    beforeEach(()=>{
      grid = new Grid({size: 5});
    });

    it('should iterate over each cell, and apply the passed function', ()=>{
      grid.forEachCell((cell)=>{
        expect(cell.alreadyCalled).toEqual(undefined);
        cell.alreadyCalled = true;
      });

      grid.forEachCell((cell) =>{
        expect(cell.alreadyCalled).toEqual(true);
      });
    });
  });
});

describe('Cell', function() {
  describe('constructor', function() {
    var args;

    beforeEach(()=>{
      let grid = new Grid();
      let row = 0;
      let col = 0;

      args = {row, grid, col};
    });

    it('should initialize with the correct attributes', ()=>{
      let cell = new Cell(args);
      for (let arg in args) {
        expect(cell[arg]).toEqual(args[arg]);
      }
    });
  });

  describe('neighbors', function() {
    var grid, cell1, cell2, cell3;

    beforeEach(()=>{
      grid = new Grid({size: 3});
      cell1 = grid[0][0];
      cell2 = grid[0][1];
      cell3 = grid[1][1];
    });

    it('should have the correct number of neighbors', ()=>{
      expect(cell1.neighbors.length).toEqual(2);
      expect(cell2.neighbors.length).toEqual(3);
      expect(cell3.neighbors.length).toEqual(4);
    });
  });
});

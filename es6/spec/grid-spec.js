import { Grid } from '../grid';

describe('Grid', function() {

  describe('constructor', function() {
    it('should keep track of all grids', ()=> {
      let originalCount = Grid.count;
      let grid = new Grid();
      expect(Grid.count).toBe(originalCount + 1);
    });
  });
});


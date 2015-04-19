"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Grid = function Grid() {
  var args = arguments[0] === undefined ? {} : arguments[0];

  _classCallCheck(this, Grid);

  this.rowN = args.rows || 0;
  this.colN = args.cols || 0;
  this.cellType = args.cellType || Object;

  for (var r = 0; r < this.rowN; r++) {
    this[r] = [];

    for (var c = 0; c < this.colN; c++) {
      this[r][c] = new this.cellType({
        row: r, col: c, parent: this
      });
    }
  }

  Grid.count += 1;
};

exports.Grid = Grid;
;

Grid.count = 0;

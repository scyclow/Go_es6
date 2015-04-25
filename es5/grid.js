"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Grid = (function () {
  function Grid() {
    var args = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Grid);

    this.rowN = args.rows || args.size || 1;
    this.colN = args.cols || args.size || 1;
    this.size = this.rowN * this.colN;
    this._rows = [];
    this._cols = [];
    this.cellType = args.cellType || Cell;

    for (var r = 0; r < this.rowN; r++) {
      this[r] = this._rows[r] = [];

      for (var c = 0; c < this.colN; c++) {
        if (!r) this._cols[c] = [];

        this[r][c] = this._cols[c][r] = new this.cellType({
          row: r, col: c, grid: this
        });
      }
    }

    Grid.count += 1;
  }

  _createClass(Grid, [{
    key: "rows",
    get: function () {
      return this._rows;
    }
  }, {
    key: "cols",
    get: function () {
      return this._cols;
    }
  }, {
    key: Symbol.iterator,
    value: function () {
      this._curIx = 0;
      return this;
    }
  }, {
    key: "next",
    value: function next() {
      if (this._curIx < this.rowN) {
        this._curIx += 1;
        return { value: this[this._curIx - 1] };
      } else {
        return { done: true };
      }
    }
  }, {
    key: "forEachCell",
    value: function forEachCell(fn) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var row = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = row[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var cell = _step2.value;

              fn(cell);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return Grid;
})();

exports.Grid = Grid;
;

Grid.count = 0;

var Cell = (function () {
  function Cell() {
    var args = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Cell);

    this.row = args.row;
    this.col = args.col;
    this.grid = args.grid;
  }

  _createClass(Cell, [{
    key: "neighbors",
    get: function () {
      var _this = this;

      return this._neighbors = this._neighbors || [[this.row + 1, this.col], [this.row - 1, this.col], [this.row, this.col + 1], [this.row, this.col - 1]].map(function (coords) {
        var _coords = _slicedToArray(coords, 2);

        var r = _coords[0];
        var c = _coords[1];

        return _this.grid[r] && _this.grid[r][c];
      }).filter(function (n) {
        return n;
      });
    }
  }]);

  return Cell;
})();

exports.Cell = Cell;

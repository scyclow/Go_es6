'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Grid$Cell = require('./grid');

var BLACK = Symbol('BLACK');
var WHITE = Symbol('WHITE');

var color = { BLACK: BLACK, WHITE: WHITE };

exports.color = color;

var Board = (function (_Grid) {
  function Board() {
    var args = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Board);

    var size = args.size || 19;
    var childType = args.childType || Space;

    _get(Object.getPrototypeOf(Board.prototype), 'constructor', this).call(this, { size: size, childType: childType });

    this.currentTurn = 0;
  }

  _inherits(Board, _Grid);

  return Board;
})(_Grid$Cell.Grid);

exports.Board = Board;

var Space = (function (_Cell) {
  function Space() {
    var args = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Space);

    _get(Object.getPrototypeOf(Space.prototype), 'constructor', this).call(this, args);
    this.board = args.grid;
    this.color = null;

    this._liberties = {};
  }

  _inherits(Space, _Cell);

  _createClass(Space, [{
    key: 'placeStone',
    value: function placeStone(color) {
      this.color = color;
      this.board.currentTurn += 1;
      this.updateNeighbors(this.board.currentTurn);
      return this;
    }
  }, {
    key: 'killStone',
    value: function killStone() {
      this.color = null;
    }
  }, {
    key: 'liberties',
    get: function () {
      return this._liberties.latest;
    }
  }, {
    key: 'updateNeighbors',
    value: function updateNeighbors() {
      this._updateSiblings();
      this._updateEnemies();
    }
  }, {
    key: '_updateSiblings',
    value: function _updateSiblings() {
      var turn = this.board.currentTurn;
      var queue = [this];
      var liberties = new Set();

      while (queue.length) {
        var stone = queue.pop();

        if (!stone._liberties[turn] && stone.color) {

          if (stone.color === this.color) {
            liberties.extend(stone._immediateLiberties());
            stone._liberties[turn] = stone._liberties.latest = liberties;
          }

          queue = queue.concat(stone.neighbors);
        }
      }
    }
  }, {
    key: '_updateEnemies',
    value: function _updateEnemies() {
      var _this = this;

      var turn = this.board.currentTurn;
      this.neighbors.forEach(function (neighbor) {
        if (neighbor.color !== _this.color) {
          neighbor._updateSiblings();
        }
      });
    }
  }, {
    key: '_immediateLiberties',
    value: function _immediateLiberties() {
      var liberties = new Set();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.neighbors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var neighbor = _step.value;

          if (!neighbor.color) liberties.add(neighbor);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return liberties;
    }
  }]);

  return Space;
})(_Grid$Cell.Cell);

exports.Space = Space;

Set.prototype.union = function () {
  for (var _len = arguments.length, otherSets = Array(_len), _key = 0; _key < _len; _key++) {
    otherSets[_key] = arguments[_key];
  }

  var newSet = new Set(this);
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = otherSets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var otherSet = _step2.value;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = otherSet[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var s = _step3.value;

          newSet.add(s);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2['return']) {
        _iterator2['return']();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return newSet;
};

Set.prototype.extend = function () {
  for (var _len2 = arguments.length, otherSets = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    otherSets[_key2] = arguments[_key2];
  }

  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = otherSets[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var otherSet = _step4.value;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = otherSet[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var s = _step5.value;

          this.add(s);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5['return']) {
            _iterator5['return']();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4['return']) {
        _iterator4['return']();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return this;
};

function log() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  console.log.apply(console, args);
}

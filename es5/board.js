'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Grid$Cell = require('./grid');

var Board = (function (_Grid) {
  function Board() {
    var args = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Board);

    var size = args.size || 19;
    var childType = args.childType || Space;

    _get(Object.getPrototypeOf(Board.prototype), 'constructor', this).call(this, { size: size, childType: childType });
  }

  _inherits(Board, _Grid);

  return Board;
})(_Grid$Cell.Grid);

exports.Board = Board;

var Space = (function (_Cell) {
  function Space() {
    var args = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Space);

    var board = args.board;

    _get(Object.getPrototypeOf(Space.prototype), 'constructor', this).call(this, {
      grid: board,
      row: args.row,
      col: args.col
    });

    this.board = board;
  }

  _inherits(Space, _Cell);

  return Space;
})(_Grid$Cell.Cell);

exports.Space = Space;

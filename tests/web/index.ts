// tslint:disable-next-line
require('./app.css');

// missing types
type ChessBoard = (selector: string, options: ChessBoardOptions) => any;
// tslint:disable-next-line
interface ChessBoardOptions {
  position: string;
  draggable: boolean;
  pieceTheme: string;
  onDragStart: (source: string, piece: string, position: string, orientation: string) => boolean | void;
  onDrop: (source: string, target: string, piece: string, newPos: string, oldPos: string, orientation: string) => string | void;
}

declare global {
  // tslint:disable-next-line
  interface Window {
    ChessBoard: ChessBoard;
    Engine: Game;
    Board: any;
  }
}
// import jquery
// @ts-ignore
// tslint:disable-next-line
window.$ = window.jQuery = require('jquery');
// import chessboard.js
// tslint:disable-next-line
require('@chrisoakman/chessboardjs/dist/chessboard-1.0.0.min.js');
const ChessBoard = window.ChessBoard as ChessBoard;
// import engine
import Game, {Point} from '../../lib/index';
// @ts-ignore
global.Game = Game;
// -------------------------------------------

function highlightSquares(arr: string[]) {
  arr.forEach(square => {
    // @ts-ignore
    document.querySelector('#board .square-' + square).classList.add('legalMove');
  });
}
function removeSquareHighlights() {
  document.querySelectorAll('#board .legalMove').forEach($square => {
    $square.classList.remove('legalMove');
  });
}
const only = '2r2k2/1B2pp2/8/6pP/1R2N3/8/2Q2P2/R3K2R w KQ - 1 2';
const start = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const fen = only;

const message = document.querySelector('.message');


const engine = new Game(fen);
engine.on('checkMate', (winner) => {
  // @ts-ignore
  message.innerHTML = (`GameOver, winner => ${winner}`)
});
engine.on('staleMate', () => {
  // @ts-ignore
  message.innerHTML = (`Draw, stalemate`)
});


window.Engine = engine;
const board = ChessBoard('board', {
  draggable: true,
  pieceTheme: 'assets/pieces/{piece}.png',
  position: fen,
  // tslint:disable-next-line
  onDragStart: function(source, piece, position, orientation) {
    if (engine.turn !== piece.charAt(0)) {
      return false;
    }
    // @ts-ignore
    const possibleMoves = engine.select(source).getPossibleMoves();
    highlightSquares(possibleMoves.map(({x, y}) => Point.getNotation(x, y)));
  },
    // tslint:disable-next-line
  onDrop: function(source, target) {
    removeSquareHighlights();
    if (source === target) {
      return;
    }
    try {
      const piece = engine.select(source);
      if (piece !== null) {
        const move = piece.move(target);
      }
    } catch (err) {
      return 'snapback';
    }
    setTimeout(() => {
      board.position(engine.toFen());
    }, 10);
  }
});
window.Board = board;

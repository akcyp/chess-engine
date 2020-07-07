# Chess engine

## Usage

```js
const engine = new Game('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

engine.on('checkMate', (winner) => {
  console.log(`GameOver, winner => ${winner}`)
});
engine.on('staleMate', () => {
  console.log(`Draw, stalemate`);
});

engine.select('e2').move('e5');

const fenString = engine.toFen(); // getting fen string

engine.select('e7').getPossibleMoves(); // list of possible places to go with pawn at e7

engine.turn; // one of ['w', 'b']

```

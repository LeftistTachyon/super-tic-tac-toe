type OuterBoard = InnerBoard[][];
type InnerBoard = { winner: number; board: number[][] };
type Move = {
  board: OuterBoard;
  outerY: number; // 0, 1, 2
  outerX: number; // 0, 1, 2
  innerY: number; // 0, 1, 2
  innerX: number; // 0, 1, 2
  player: number; // 1 = X, 2 = O
};

export function nextMoves(move: Move) {
  // make copy of board to modify & validate move
  const boardCopy = structuredClone(move.board);
  const inner = boardCopy[move.outerY]?.[move.outerX];
  if (!inner || inner.winner) return;

  // make the move
  const temp = inner.board[move.innerY];
  if (!temp) return;
  temp[move.innerX] = move.player;
}

export function setInnerWinner(inner: InnerBoard) {
  if (inner.winner !== 0) return;

  for (let i = 0; i < 3; ++i) {
    const first = inner.board[i]?.[0];
  }
}

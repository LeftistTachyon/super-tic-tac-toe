/* 
board ordering convention:
012
345
678
*/
type OuterBoard = InnerBoard[];
type InnerBoard = {
  winner: number; // -1 for draw, 0 for ongoing, 1 = X, 2 = O
  board: number[];
};
type Move = {
  board: OuterBoard;
  outer: number; // 0 to 8
  inner: number; // 0 to 8
  player: number; // 1 = X, 2 = O
};

export function nextMoves(move: Move) {
  // make copy of board to modify & validate move
  const boardCopy = move.board.slice();
  const inner = (boardCopy[move.inner] = Object.assign(
    {},
    boardCopy[move.outer]
  ));
  if (inner.winner) return [];

  // make the move
  inner.board = inner.board.slice();
  inner.board[move.inner] = move.player;
  // update inner board
  setInnerWinner(inner);

  // limit moves to that board
  if (boardCopy[move.inner]?.winner) {
    // board is already finished, don't limit
    const output: Move[] = [];
    for (let outer = 0; outer < 9; outer++) {
      const innerBoard = boardCopy[outer];
      if (!innerBoard || innerBoard.winner) continue;

      for (let inner = 0; inner < 9; inner++) {
        if (!innerBoard.board[inner])
          output.push({
            board: boardCopy,
            inner,
            outer,
            player: move.player == 1 ? 2 : 1,
          });
      }
    }

    return output;
  } else {
    // limit
    const outer = move.inner,
      innerBoard = boardCopy[outer];
    if (!innerBoard) throw new ReferenceError(`Board ${outer} does not exist!`);

    const output: Move[] = [];
    for (let inner = 0; inner < 9; inner++) {
      if (!innerBoard.board[inner])
        output.push({
          board: boardCopy,
          inner,
          outer,
          player: move.player == 1 ? 2 : 1,
        });
    }
    return output;
  }
}

export function setInnerWinner(inner: InnerBoard) {
  if (inner.winner !== 0) return;

  // check across
  for (let i = 0; i < 9; i += 3) {
    const first = inner.board[i];
    if (!first) continue; // first not even filled

    if (first === inner.board[i + 1] && first === inner.board[i + 2]) {
      // all match
      inner.winner = first;
      return;
    }
  }

  // check down
  for (let i = 0; i < 3; ++i) {
    const first = inner.board[i];
    if (!first) continue; // first not filled

    if (first === inner.board[i + 3] && first === inner.board[i + 6]) {
      // all match
      inner.winner = first;
      return;
    }
  }

  // check diags
  const center = inner.board[4];
  if (
    center &&
    ((center === inner.board[0] && center === inner.board[8]) ||
      (center === inner.board[2] && center === inner.board[6]))
  ) {
    inner.winner = center;
    return;
  }

  // check for draw
  for (let i = 0; i < 9; i++) {
    if (!inner.board[i]) {
      inner.winner = 0; // board is not filled yet
      return;
    }
  }
  inner.winner = -1; // board is filled with no winner
}

export function findOuterWinner(outer: OuterBoard) {
  // check across
  for (let i = 0; i < 9; i += 3) {
    const first = outer[i];
    if (!first || first.winner <= 0) continue; // first not even filled

    if (
      first.winner === outer[i + 1]?.winner &&
      first.winner === outer[i + 2]?.winner
    ) {
      // all match
      return first.winner;
    }
  }

  // check down
  for (let i = 0; i < 3; ++i) {
    const first = outer[i];
    if (!first || first.winner <= 0) continue; // first not even filled

    if (
      first.winner === outer[i + 3]?.winner &&
      first.winner === outer[i + 6]?.winner
    ) {
      // all match
      return first.winner;
    }
  }

  // check diags
  const center = outer[4];
  if (
    center &&
    center.winner > 0 &&
    ((center.winner === outer[0]?.winner &&
      center.winner === outer[8]?.winner) ||
      (center.winner === outer[2]?.winner &&
        center.winner === outer[6]?.winner))
  ) {
    return center;
  }

  // check for draw
  for (let i = 0; i < 9; i++) {
    if (!outer[i]?.winner) {
      return 0;
    }
  }
  return -1; // board is filled with no winner
}

import {
  findOuterWinner,
  getEmptyBoard,
  getFirstMoves,
  getNextMoves,
  performMove,
} from "./board";
import type { Move } from "./types";

export function firstAlphabeta(
  depth: number,
  alpha = Number.MIN_SAFE_INTEGER,
  beta = Number.MAX_SAFE_INTEGER
) {
  if (depth === 0) return { value: 0 };

  // generate first moves
  const nextMoves = getFirstMoves(getEmptyBoard());

  // maximizing player next
  let value = Number.MIN_SAFE_INTEGER,
    best: Move | undefined = undefined;
  for (const move of nextMoves) {
    const evaulation = alphabeta(move, depth - 1, alpha, beta);
    if (evaulation > value) {
      best = move; // to keep track of best variation
      value = evaulation;
    }

    if (value >= beta) break; // beta cutoff
    alpha = Math.max(alpha, value);
  }
  return { value, best };
}

export function alphabeta(
  node: Move,
  depth: number,
  alpha: number,
  beta: number
) {
  if (depth === 0) return heuristicValue(node);

  // get list of next moves
  const nextMoves = getNextMoves(node);
  if (!nextMoves.length) return heuristicValue(node);

  if (node.player === 2) {
    // maximizing player next
    let value = Number.MIN_SAFE_INTEGER;
    for (const move of nextMoves) {
      value = Math.max(value, alphabeta(move, depth - 1, alpha, beta));
      if (value >= beta) break; // beta cutoff
      alpha = Math.max(alpha, value);
    }
    return value;
  } else {
    // minimizing player next
    let value = Number.MAX_SAFE_INTEGER;
    for (const move of nextMoves) {
      value = Math.min(value, alphabeta(move, depth - 1, alpha, beta));
      if (value <= alpha) break; // alpha cutoff
      beta = Math.min(beta, value);
    }
    return value;
  }
}

export function heuristicValue(node: Move) {
  // find terminal node
  const board = performMove(node);
  if (!board) return 0;

  // check outer winners
  const winner = findOuterWinner(board);
  switch (winner) {
    case 1:
      return 2500;
    case 2:
      return -2500;
    case 0:
      let rating = 0;
      for (const innerBoard of board) {
        // check inner board winnings first
        if (innerBoard.winner === 1) {
          rating += 50;
        } else if (innerBoard.winner === 2) {
          rating -= 50;
        } else if (innerBoard.winner !== -1) {
          // count the innards if not drawn
          rating += countInner(innerBoard.board);
        }
      }

      return rating;
    case -1:
    default:
      return 0;
  }
}

function countInner(inner: number[]) {
  let score = 0;

  // check across
  for (let i = 0; i < 9; i += 3) {
    let cnt = 0;
    for (let j = i; j < i + 3; j++) {
      if (inner[j] === 1) {
        cnt++;
        score++;
      } else if (inner[j] === 2) {
        cnt--;
        score--;
      }
    }

    if (cnt === 2) score += 5;
    else if (cnt === -2) score -= 5;
  }

  // check down
  for (let i = 0; i < 3; ++i) {
    let cnt = 0;
    for (let j = i; j < 9; j += 3) {
      if (inner[j] === 1) {
        cnt++;
      } else if (inner[j] === 2) {
        cnt--;
      }
    }

    if (cnt === 2) score += 5;
    else if (cnt === -2) score -= 5;
  }

  // check diags
  let cnt1 = 0,
    cnt2 = 0;
  for (let i = 0; i < 3; ++i) {
    if (inner[4 * i] === 1) cnt1++;
    else if (inner[4 * i] === 2) cnt1--;
    if (inner[2 + 2 * i] === 1) cnt2++;
    else if (inner[2 + 2 * i] === 2) cnt2--;
  }
  // score diags
  if (cnt1 === 2) score += 5;
  else if (cnt1 === -2) score -= 5;
  if (cnt2 === 2) score += 5;
  else if (cnt2 === -2) score -= 5;

  return score;
}

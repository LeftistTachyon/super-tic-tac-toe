import { boardToString, getFirstMoves, getNextMoves } from "./board";
import type { OuterBoard } from "./types";

const board: OuterBoard = Array(9);
board.fill({ board: Array(9), winner: 0 });
// console.log(board);

const firstMoves = getFirstMoves(board);
// console.log(firstMoves.slice(0, 5));

const nextMoves = getNextMoves(getNextMoves(firstMoves[0])[0]);
console.log(nextMoves[0]);
console.log(boardToString(nextMoves[0].board));

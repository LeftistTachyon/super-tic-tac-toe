import {
  boardToString,
  getEmptyBoard,
  getFirstMoves,
  getNextMoves,
} from "./board";

// console.log(board);

const firstMoves = getFirstMoves(getEmptyBoard());
// console.log(firstMoves.slice(0, 5));

const nextMoves = getNextMoves(getNextMoves(firstMoves[0])[0]);
console.log(nextMoves[0]);
console.log(boardToString(nextMoves[0].board));

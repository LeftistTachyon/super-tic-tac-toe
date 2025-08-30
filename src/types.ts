/* 
board ordering convention:
012
345
678
*/
export type OuterBoard = InnerBoard[];
export type InnerBoard = {
  winner: number; // -1 for draw, 0 for ongoing, 1 = X, 2 = O
  board: number[];
};
export type Move = {
  board: OuterBoard;
  outer: number; // 0 to 8
  inner: number; // 0 to 8
  player: number; // 1 = X, 2 = O
};

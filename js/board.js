import { COLS, ROWS } from "./constants.js";

/**
 * 빈 보드 2차원 배열을 만든다.
 * @returns {(string|null)[][]}
 */
export function createEmptyBoard() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => null),
  );
}

/**
 * 이동 후 위치에서 충돌 없이 놓일 수 있는지 판정한다.
 * @param {import("./pieces.js").Piece} piece - 현재 블록
 * @param {number} dx - 가로 이동량
 * @param {number} dy - 세로 이동량
 * @param {(string|null)[][]} matrix - 고정된 블록 보드
 * @returns {boolean}
 */
export function canMove(piece, dx, dy, matrix) {
  const nextRow = piece.row + dy;
  const nextCol = piece.col + dx;

  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) {
        continue;
      }

      const boardRow = nextRow + r;
      const boardCol = nextCol + c;

      if (
        boardRow < 0 ||
        boardRow >= ROWS ||
        boardCol < 0 ||
        boardCol >= COLS
      ) {
        return false;
      }

      if (matrix[boardRow][boardCol] !== null) {
        return false;
      }
    }
  }

  return true;
}

/**
 * 현재 블록을 보드에 고정한다.
 * @param {import("./pieces.js").Piece} piece - 고정할 블록
 * @param {(string|null)[][]} matrix - 고정된 블록 보드
 */
export function lockPiece(piece, matrix) {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) {
        continue;
      }

      const boardRow = piece.row + r;
      const boardCol = piece.col + c;

      if (
        boardRow >= 0 &&
        boardRow < ROWS &&
        boardCol >= 0 &&
        boardCol < COLS
      ) {
        matrix[boardRow][boardCol] = piece.color;
      }
    }
  }
}

/**
 * 보드 상태에 현재 블록을 합쳐 표시용 보드를 반환한다.
 * @param {(string|null)[][]} board - 고정된 블록이 있는 보드
 * @param {import("./pieces.js").Piece} piece - 현재 떨어지는 블록
 * @returns {(string|null)[][]}
 */
export function drawPiece(board, piece) {
  const display = board.map((row) => [...row]);

  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) {
        continue;
      }

      const boardRow = piece.row + r;
      const boardCol = piece.col + c;

      if (
        boardRow >= 0 &&
        boardRow < ROWS &&
        boardCol >= 0 &&
        boardCol < COLS
      ) {
        display[boardRow][boardCol] = piece.color;
      }
    }
  }

  return display;
}

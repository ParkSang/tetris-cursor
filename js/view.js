import { COLS, ROWS } from "./constants.js";
import { drawPiece } from "./board.js";

/** @type {HTMLElement|null} */
let boardElement = null;

/**
 * 보드 DOM에 10×20 칸 요소를 생성한다.
 * @param {HTMLElement} element
 */
function buildBoardCells(element) {
  element.replaceChildren();

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("role", "gridcell");
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      element.appendChild(cell);
    }
  }
}

/**
 * 보드 상태를 CSS grid DOM에 렌더링한다.
 * @param {(string|null)[][]} board - 렌더링할 보드 상태
 * @param {HTMLElement} element - 보드 컨테이너 요소
 */
function renderBoard(board, element) {
  const cells = element.querySelectorAll(".cell");

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = cells[row * COLS + col];
      const color = board[row][col];

      if (!(cell instanceof HTMLElement)) {
        continue;
      }

      if (color) {
        cell.style.backgroundColor = color;
        cell.classList.add("filled");
      } else {
        cell.style.backgroundColor = "";
        cell.classList.remove("filled");
      }
    }
  }
}

/**
 * 보드 DOM을 초기화하고 참조를 저장한다.
 * @param {HTMLElement} element
 */
export function mountBoard(element) {
  boardElement = element;
  buildBoardCells(boardElement);
}

/**
 * 게임 상태를 보드 DOM에 반영한다.
 * @param {(string|null)[][]} matrix - 고정된 블록 보드
 * @param {import("./pieces.js").Piece|null} currentPiece - 현재 블록
 */
export function renderGame(matrix, currentPiece) {
  if (!boardElement || !currentPiece) {
    return;
  }

  const displayBoard = drawPiece(matrix, currentPiece);
  renderBoard(displayBoard, boardElement);
}

/**
 * 점수 표시를 초기값으로 되돌린다.
 * @param {HTMLElement} scoreElement
 */
export function resetScore(scoreElement) {
  scoreElement.textContent = "0";
}

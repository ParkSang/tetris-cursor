import { FALL_INTERVAL_MS } from "./constants.js";
import { canMove, createEmptyBoard, lockPiece } from "./board.js";
import {
  createPiece,
  pickRandomPieceType,
  rotateShape,
} from "./pieces.js";
import { renderGame, resetScore } from "./view.js";

/**
 * @typedef {Object} GameState
 * @property {(string|null)[][]} matrix - 고정된 블록만 담긴 보드
 * @property {import("./pieces.js").Piece|null} currentPiece - 현재 떨어지는 블록
 * @property {number|null} fallTimerId - 자동 낙하 타이머 ID
 * @property {boolean} isRunning - 게임 진행 여부
 */

/** @type {GameState} */
const gameState = {
  matrix: createEmptyBoard(),
  currentPiece: null,
  fallTimerId: null,
  isRunning: false,
};

/** 키보드 이벤트 등록 여부 */
let isKeyboardBound = false;

/**
 * 현재 게임 상태를 화면에 반영한다.
 */
function updateDisplay() {
  renderGame(gameState.matrix, gameState.currentPiece);
}

/**
 * 자동 낙하 타이머를 중지한다.
 */
function stopGameLoop() {
  if (gameState.fallTimerId !== null) {
    clearInterval(gameState.fallTimerId);
    gameState.fallTimerId = null;
  }

  gameState.isRunning = false;
}

/**
 * 자동 낙하 타이머를 시작한다.
 */
function startGameLoop() {
  stopGameLoop();
  gameState.fallTimerId = setInterval(dropStep, FALL_INTERVAL_MS);
  gameState.isRunning = true;
}

/**
 * 현재 블록을 고정하고 새 블록을 생성한다.
 */
function settleCurrentPiece() {
  if (!gameState.currentPiece) {
    return;
  }

  lockPiece(gameState.currentPiece, gameState.matrix);
  gameState.currentPiece = createPiece(pickRandomPieceType());

  if (!canMove(gameState.currentPiece, 0, 0, gameState.matrix)) {
    stopGameLoop();
  }

  updateDisplay();
}

/**
 * 충돌 판정을 통과할 때만 블록을 이동한다.
 * @param {number} dx - 가로 이동량
 * @param {number} dy - 세로 이동량
 * @returns {boolean} 이동 성공 여부
 */
function tryMovePiece(dx, dy) {
  if (!gameState.currentPiece || !gameState.isRunning) {
    return false;
  }

  if (!canMove(gameState.currentPiece, dx, dy, gameState.matrix)) {
    return false;
  }

  gameState.currentPiece.row += dy;
  gameState.currentPiece.col += dx;
  updateDisplay();
  return true;
}

/**
 * 블록을 시계 방향으로 회전한다. 충돌 시 회전을 취소한다.
 * @returns {boolean} 회전 성공 여부
 */
function tryRotatePiece() {
  if (!gameState.currentPiece || !gameState.isRunning) {
    return false;
  }

  const piece = gameState.currentPiece;
  const originalShape = piece.shape.map((row) => [...row]);
  piece.shape = rotateShape(piece.shape);

  if (!canMove(piece, 0, 0, gameState.matrix)) {
    piece.shape = originalShape;
    return false;
  }

  updateDisplay();
  return true;
}

/**
 * 블록을 한 칸 아래로 빠르게 내린다.
 */
function softDrop() {
  if (!gameState.currentPiece || !gameState.isRunning) {
    return;
  }

  if (tryMovePiece(0, 1)) {
    return;
  }

  settleCurrentPiece();
}

/**
 * 블록을 바닥 또는 고정 블록까지 즉시 내린다.
 */
function hardDrop() {
  if (!gameState.currentPiece || !gameState.isRunning) {
    return;
  }

  while (canMove(gameState.currentPiece, 0, 1, gameState.matrix)) {
    gameState.currentPiece.row += 1;
  }

  settleCurrentPiece();
}

/**
 * 블록을 한 칸 아래로 내리거나, 충돌 시 고정 후 새 블록을 생성한다.
 */
function dropStep() {
  if (!gameState.currentPiece || !gameState.isRunning) {
    return;
  }

  if (canMove(gameState.currentPiece, 0, 1, gameState.matrix)) {
    gameState.currentPiece.row += 1;
    updateDisplay();
    return;
  }

  settleCurrentPiece();
}

/**
 * 키보드 입력을 처리한다.
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
  if (!gameState.isRunning) {
    return;
  }

  switch (event.code) {
    case "ArrowLeft":
      event.preventDefault();
      tryMovePiece(-1, 0);
      break;
    case "ArrowRight":
      event.preventDefault();
      tryMovePiece(1, 0);
      break;
    case "ArrowDown":
      event.preventDefault();
      softDrop();
      break;
    case "ArrowUp":
      event.preventDefault();
      tryRotatePiece();
      break;
    case "Space":
      event.preventDefault();
      hardDrop();
      break;
    default:
      break;
  }
}

/**
 * 키보드 조작 이벤트를 한 번만 등록한다.
 */
export function bindKeyboardControls() {
  if (isKeyboardBound) {
    return;
  }

  document.addEventListener("keydown", handleKeyDown);
  isKeyboardBound = true;
}

/**
 * 게임을 초기 상태로 설정한다.
 * @param {HTMLElement} scoreElement
 */
export function initGame(scoreElement) {
  stopGameLoop();

  gameState.matrix = createEmptyBoard();
  gameState.currentPiece = createPiece(pickRandomPieceType());

  resetScore(scoreElement);
  updateDisplay();
  startGameLoop();
}

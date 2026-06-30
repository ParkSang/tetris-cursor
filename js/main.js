import { bindKeyboardControls, initGame } from "./game.js";
import { mountBoard } from "./view.js";

/**
 * 페이지 로드 시 게임을 초기화한다.
 */
function setup() {
  const boardElement = document.getElementById("game-board");
  const scoreElement = document.getElementById("score");
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");

  if (!(boardElement instanceof HTMLElement)) {
    throw new Error("게임 보드 요소를 찾을 수 없습니다.");
  }
  if (!(scoreElement instanceof HTMLElement)) {
    throw new Error("점수 요소를 찾을 수 없습니다.");
  }

  mountBoard(boardElement);
  bindKeyboardControls();
  initGame(scoreElement);

  startBtn?.addEventListener("click", () => {
    initGame(scoreElement);
  });

  restartBtn?.addEventListener("click", () => {
    initGame(scoreElement);
  });
}

setup();

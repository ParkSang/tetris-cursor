import { COLS } from "./constants.js";

/**
 * @typedef {Object} Piece
 * @property {string} type - 블록 종류 (I, O, T, S, Z, J, L)
 * @property {number[][]} shape - 블록 모양 행렬 (1=칸 있음, 0=빈 칸)
 * @property {string} color - 블록 색상
 * @property {number} row - 보드상 세로 위치 (행)
 * @property {number} col - 보드상 가로 위치 (열)
 */

/** 블록 종류 목록 */
const PIECE_TYPES = ["I", "O", "T", "S", "Z", "J", "L"];

/** 7가지 테트로미노 정의 */
const PIECE_DEFINITIONS = {
  I: {
    color: "#00f0f0",
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  O: {
    color: "#f0f000",
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  T: {
    color: "#a000f0",
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  S: {
    color: "#00f000",
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
  },
  Z: {
    color: "#f00000",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
  },
  J: {
    color: "#0000f0",
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  L: {
    color: "#f0a000",
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
};

/**
 * 블록 객체를 생성한다.
 * @param {string} type - 블록 종류 (I, O, T, S, Z, J, L)
 * @returns {Piece}
 */
export function createPiece(type) {
  const definition = PIECE_DEFINITIONS[type];
  if (!definition) {
    throw new Error(`알 수 없는 블록 종류: ${type}`);
  }

  const shapeWidth = definition.shape[0].length;

  return {
    type,
    shape: definition.shape.map((row) => [...row]),
    color: definition.color,
    row: 0,
    col: Math.floor((COLS - shapeWidth) / 2),
  };
}

/**
 * 블록 shape를 시계 방향 90도 회전한다.
 * @param {number[][]} shape - 블록 모양 행렬
 * @returns {number[][]}
 */
export function rotateShape(shape) {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }

  return rotated;
}

/**
 * 무작위 블록 종류를 반환한다.
 * @returns {string}
 */
export function pickRandomPieceType() {
  const index = Math.floor(Math.random() * PIECE_TYPES.length);
  return PIECE_TYPES[index];
}

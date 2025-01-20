export const TETROMINO_TYPES = {
  T: 'T',
  O: 'O',
  I: 'I',
  Z: 'Z',
  S: 'S',
  L: 'L',
  J: 'J',

};

export const TETROMINO_SHAPES = {
  [TETROMINO_TYPES.T]: {
      shape: [[1, 1, 1], [0, 1, 0]],
      className: 'tetromino-T',
      color: '#a000f0'
  },
  [TETROMINO_TYPES.O]: {
      shape: [[1, 1], [1, 1]],
      className: 'tetromino-O',
      color: '#f0f000'
  },
  [TETROMINO_TYPES.I]: {
      shape: [[1, 1, 1, 1]],
      className: 'tetromino-I',
      color: '#00f0f0'
  },
  [TETROMINO_TYPES.Z]: {
      shape: [[1, 1, 0], [0, 1, 1]],
      className: 'tetromino-Z',
      color: '#f00000'
  },
  [TETROMINO_TYPES.S]: {
      shape: [[0, 1, 1], [1, 1, 0]],
      className: 'tetromino-S',
      color: '#00f000'
  },
  [TETROMINO_TYPES.L]: {
      shape: [[1, 1, 1], [1, 0, 0]],
      className: 'tetromino-L',
      color: '#f0a000'
  },
  [TETROMINO_TYPES.J]: {
      shape: [[1, 1, 1], [0, 0, 1]],
      className: 'tetromino-J',
      color: '#0000f0'
  }
};

export const GAME_CONSTANTS = {
  boardWidth: 10,
  boardHeight: 20,
  blockSize: 30,
  initialSpeed: 800,
  speedIncrement: 50,
  levelThreshold: 1000
};

// Updated generator function
export const generateTetromino = () => {
  const tetrominoTypes = Object.values(TETROMINO_TYPES);
  const randomType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
  const { shape, color, className } = TETROMINO_SHAPES[randomType];

  return {
      shape,
      color,
      className,
      type: randomType,
      position: {
          x: Math.floor((GAME_CONSTANTS.boardWidth - shape[0].length) / 2),
          y: 0
      }
  };
};

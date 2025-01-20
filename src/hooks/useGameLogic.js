import { useState, useCallback, useRef } from "react";
import { GAME_CONSTANTS, TETROMINO_SHAPES, generateTetromino } from "../constants";

export const useGameLogic = () => {
  // Initialize game board with empty cells
  const [landedBlocks, setLandedBlocks] = useState(
    Array.from({ length: GAME_CONSTANTS.boardHeight }, () =>
      Array(GAME_CONSTANTS.boardWidth).fill(null)
    )
  );

  // Game state
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(GAME_CONSTANTS.initialSpeed);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isHandlingPlacement = useRef(false);

  const generateTetrominoMemo = useCallback(generateTetromino, []);

  const checkCollision = useCallback(
    (shape, position) => {
      return shape.some((row, rowIndex) =>
        row.some((cell, colIndex) => {
          if (cell === 0) return false;
          const x = position.x + colIndex;
          const y = position.y + rowIndex;
          return (
            y >= GAME_CONSTANTS.boardHeight ||
            x < 0 ||
            x >= GAME_CONSTANTS.boardWidth ||
            (y >= 0 && landedBlocks[y]?.[x])
          );
        })
      );
    },
    [landedBlocks]
  );

  const updateGridWithTetromino = useCallback(
    (tetromino) => {
      const { shape, position, color, type } = tetromino;
      const newLandedBlocks = landedBlocks.map(row => [...row]);

      shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell > 0) {
            const y = position.y + rowIndex;
            const x = position.x + colIndex;
            if (y >= 0 && y < GAME_CONSTANTS.boardHeight && x >= 0 && x < GAME_CONSTANTS.boardWidth) {
              newLandedBlocks[y][x] = {
                color,
                type,
                className: TETROMINO_SHAPES[type].className
              };
            }
          }
        });
      });

      let clearedRows = 0;
      const updatedBlocks = newLandedBlocks.filter(row => {
        if (row.every(cell => cell !== null)) {
          clearedRows++;
          return false;
        }
        return true;
      });

      
      while (updatedBlocks.length < GAME_CONSTANTS.boardHeight) {
        updatedBlocks.unshift(Array(GAME_CONSTANTS.boardWidth).fill(null));
      }

      // Update score and level
      const newScore = score + (clearedRows * 100 * level);
      setScore(newScore);

      if (newScore >= level * GAME_CONSTANTS.levelThreshold) {
        setLevel(prevLevel => prevLevel + 1);
        setSpeed(prevSpeed => Math.max(prevSpeed - GAME_CONSTANTS.speedIncrement, 100));
      }

      setLandedBlocks(updatedBlocks);
      return { updatedBlocks, clearedRows };
    },
    [landedBlocks, score, level]
  );

  const resetGame = useCallback(() => {
    setLandedBlocks(
      Array.from({ length: GAME_CONSTANTS.boardHeight }, () =>
        Array(GAME_CONSTANTS.boardWidth).fill(null)
      )
    );
    setScore(0);
    setLevel(1);
    setSpeed(GAME_CONSTANTS.initialSpeed);
    setGameOver(false);
    setIsPaused(false);
  }, []);

  return {
    landedBlocks,
    setLandedBlocks,
    level,
    setLevel,
    speed,
    setSpeed,
    score,
    setScore,
    gameOver,
    setGameOver,
    isPaused,
    setIsPaused,
    isHandlingPlacement,
    generateTetromino: generateTetrominoMemo,
    checkCollision,
    updateGridWithTetromino,
    resetGame
  };
};

import React, { useState, useEffect, useCallback } from "react";
import { useGameLogic } from "../hooks/useGameLogic";
import { useTetrominoMovement } from "../hooks/useTetrominoMovement";
import GameBoard from "./GameBoard";
import Sidebar from "./Sidebar";
import { GAME_CONSTANTS } from "../constants";

function GameScreen() {
  const {
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
    generateTetromino,
    checkCollision,
  } = useGameLogic();

  const [activeTetromino, setActiveTetromino] = useState(generateTetromino);
  const [nextTetromino, setNextTetromino] = useState(generateTetromino);

  const { handleKeyPress } = useTetrominoMovement(
    checkCollision,
    setActiveTetromino,
    isPaused,
    gameOver
  );

  const updateGridWithTetromino = useCallback(
    (shape, position, color) => {
      const newLandedBlocks = landedBlocks.map((row) => [...row]);

      shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell > 0) {
            const y = position.y + rowIndex;
            const x = position.x + colIndex;
            if (
              y >= 0 &&
              y < GAME_CONSTANTS.boardHeight &&
              x >= 0 &&
              x < GAME_CONSTANTS.boardWidth
            ) {
              newLandedBlocks[y][x] = color;
            }
          }
        });
      });

      let clearedRows = 0;
      const updatedBlocks = newLandedBlocks.filter((row) => {
        if (row.every((cell) => cell)) {
          clearedRows++;
          return false;
        }
        return true;
      });

      while (updatedBlocks.length < GAME_CONSTANTS.boardHeight) {
        updatedBlocks.unshift(Array(GAME_CONSTANTS.boardWidth).fill(0));
      }

      const newScore = score + clearedRows * 100 * level;
      setScore(newScore);

      if (newScore >= level * GAME_CONSTANTS.levelThreshold) {
        setLevel((prevLevel) => prevLevel + 1);
        setSpeed((prevSpeed) =>
          Math.max(prevSpeed - GAME_CONSTANTS.speedIncrement, 100)
        );
      }

      setLandedBlocks(updatedBlocks);
      return { updatedBlocks, clearedRows };
    },
    [landedBlocks, score, level, setScore, setLandedBlocks, setLevel, setSpeed]
  );

  const handleTetrominoPlacement = useCallback(() => {
    if (isHandlingPlacement.current) return;
    isHandlingPlacement.current = true;

    const { shape, position, color } = activeTetromino;
    const { updatedBlocks } = updateGridWithTetromino(shape, position, color);

    const isGameOver = updatedBlocks
      .slice(0, 2)
      .some((row) => row.some((cell) => cell !== 0));

    if (isGameOver) {
      setGameOver(true);
    } else {
      const newTetromino = nextTetromino;
      setActiveTetromino(newTetromino);
      setNextTetromino(generateTetromino());

      if (checkCollision(newTetromino.shape, newTetromino.position)) {
        setGameOver(true);
      }
    }

    isHandlingPlacement.current = false;
  }, [
    activeTetromino,
    nextTetromino,
    generateTetromino,
    updateGridWithTetromino,
    checkCollision,
    isHandlingPlacement,
    setGameOver,
  ]);

  useEffect(() => {
    const keyListener = (event) => handleKeyPress(event);
    window.addEventListener("keydown", keyListener);
    return () => window.removeEventListener("keydown", keyListener);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      const interval = setInterval(() => {
        if (isHandlingPlacement.current) return;

        setActiveTetromino((prev) => {
          const newPosition = { ...prev.position, y: prev.position.y + 1 };
          if (checkCollision(prev.shape, newPosition)) {
            queueMicrotask(() => {
              if (!isHandlingPlacement.current) {
                handleTetrominoPlacement();
              }
            });
            return prev;
          }
          return { ...prev, position: newPosition };
        });
      }, speed);
      return () => clearInterval(interval);
    }
  }, [
    gameOver,
    isPaused,
    speed,
    checkCollision,
    handleTetrominoPlacement,
    nextTetromino,
    isHandlingPlacement,
  ]);

  const restartGame = () => {
    setLandedBlocks(
      Array.from({ length: GAME_CONSTANTS.boardHeight }, () =>
        Array(GAME_CONSTANTS.boardWidth).fill(0)
      )
    );
    setScore(0);
    setLevel(1);
    setSpeed(GAME_CONSTANTS.initialSpeed);
    setActiveTetromino(generateTetromino());
    setNextTetromino(generateTetromino());
    setGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="game-container">
      <GameBoard
        landedBlocks={landedBlocks}
        activeTetromino={activeTetromino}
      />
      <Sidebar
        score={score}
        level={level}
        nextTetromino={nextTetromino}
        gameOver={gameOver}
        isPaused={isPaused}
        onRestart={restartGame}
        onPauseToggle={() => setIsPaused(!isPaused)}
        onQuit={() => setGameOver(true)}
      />
    </div>
  );
}

export default GameScreen;

import React from "react";
import Tetromino from "./Tetromino";

function Sidebar({
  score,
  level,
  nextTetromino,
  gameOver,
  isPaused,
  onRestart,
  onPauseToggle,
  onQuit,
}) {
  return (
    <div className="sidebar">
      <h2>Score: {score}</h2>
      <h3>Level: {level}</h3>
      <div className="next-piece">
        <h3>Next Piece:</h3>
        <div className="next-piece-preview">
          <Tetromino
            shape={nextTetromino.shape}
            position={{ x: 0, y: 0 }}
            color={nextTetromino.color}
          />
        </div>
      </div>
      {gameOver ? (
        <button onClick={onRestart}>Restart Game</button>
      ) : (
        <>
          <button onClick={onPauseToggle}>
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button onClick={onQuit}>Quit</button>
        </>
      )}
      {isPaused && <div className="pause-overlay">PAUSED</div>}
    </div>
  );
}

export default Sidebar;

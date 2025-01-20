import React from "react";
import { GAME_CONSTANTS } from "../constants";
import Tetromino from "./Tetromino";

function GameBoard({ landedBlocks, activeTetromino }) {
  return (
    <div
      className="board"
      style={{
        width: GAME_CONSTANTS.boardWidth * GAME_CONSTANTS.blockSize,
        height: GAME_CONSTANTS.boardHeight * GAME_CONSTANTS.blockSize,
      }}
    >
      {landedBlocks.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell ? (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                position: "absolute",
                top: rowIndex * GAME_CONSTANTS.blockSize,
                left: colIndex * GAME_CONSTANTS.blockSize,
                width: GAME_CONSTANTS.blockSize - 2,
                height: GAME_CONSTANTS.blockSize - 2,
                backgroundColor: cell,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            />
          ) : null
        )
      )}
      <Tetromino {...activeTetromino} />
    </div>
  );
}

export default GameBoard;

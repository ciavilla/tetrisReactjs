import React from "react";
import { GAME_CONSTANTS } from "../constants";

function Tetromino({ position, shape, color, className }) {
  return (
    <div className={`tetromino ${className}`}>
      {shape.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell ? (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                position: "absolute",
                top: (position.y + rowIndex) * GAME_CONSTANTS.blockSize,
                left: (position.x + colIndex) * GAME_CONSTANTS.blockSize,
                width: GAME_CONSTANTS.blockSize - 2,
                height: GAME_CONSTANTS.blockSize - 2,
                backgroundColor: color,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "inset 2px 2px 5px rgba(255, 255, 255, 0.4)",
              }}
            />
          ) : null
        )
      )}
    </div>
  );
}

export default Tetromino;

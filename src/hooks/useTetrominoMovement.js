import { useCallback } from "react";

export const useTetrominoMovement = (
  checkCollision,
  setActiveTetromino,
  isPaused,
  gameOver
) => {
  const rotateShape = useCallback((shape) => {
    return shape[0].map((_, colIndex) =>
      shape.map((row) => row[colIndex]).reverse()
    );
  }, []);

  const handleKeyPress = useCallback(
    (event) => {
      if (gameOver || isPaused) return;

      const handleMovement = (activeTetromino) => {
        const { shape, position } = activeTetromino;

        switch (event.key) {
          case "ArrowLeft": {
            const leftPosition = { ...position, x: position.x - 1 };
            if (!checkCollision(shape, leftPosition)) {
              return { ...activeTetromino, position: leftPosition };
            }
            break;
          }
          case "ArrowRight": {
            const rightPosition = { ...position, x: position.x + 1 };
            if (!checkCollision(shape, rightPosition)) {
              return { ...activeTetromino, position: rightPosition };
            }
            break;
          }
          case "ArrowUp": {
            const rotatedShape = rotateShape(shape);
            if (!checkCollision(rotatedShape, position)) {
              return { ...activeTetromino, shape: rotatedShape };
            }
            break;
          }
          case "ArrowDown": {
            const downPosition = { ...position, y: position.y + 1 };
            if (!checkCollision(shape, downPosition)) {
              return { ...activeTetromino, position: downPosition };
            }
            break;
          }
          default:
            break;
        }
        return activeTetromino;
      };

      setActiveTetromino((prev) => handleMovement(prev));
    },
    [checkCollision, gameOver, isPaused, rotateShape, setActiveTetromino]
  );

  return { handleKeyPress };
};

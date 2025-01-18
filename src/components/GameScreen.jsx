import React, {useState, useEffect, useCallback } from 'react';
import Tetromino from './Tetromino';

const TETROMINOES = [
    [[1, 1, 1], [0, 1, 0]], // T-shape
    [[1, 1], [1, 1]],       // O-shape
    [[1, 1, 1, 1]],         // I-shape
    [[1, 1, 0], [0, 1, 1]], // Z-shape
    [[0, 1, 1], [1, 1, 0]], // S-shape
    [[1, 1, 1], [1, 0, 0]], // L-shape
    [[1, 1, 1], [0, 0, 1]], // J-shape
];

const getTetrominoColor = (shape) => {
    switch (JSON.stringify(shape)) {
        case JSON.stringify([[1, 1, 1], [0, 1, 0]]): return 'purple'; // T-shape
        case JSON.stringify([[1, 1], [1, 1]]): return 'yellow'; // O-shape
        case JSON.stringify([[1, 1, 1, 1]]): return 'cyan'; // I-shape
        case JSON.stringify([[1, 1, 0], [0, 1, 1]]): return 'red'; // Z-shape
        case JSON.stringify([[0, 1, 1], [1, 1, 0]]): return 'green'; // S-shape
        case JSON.stringify([[1, 1, 1], [1, 0, 0]]): return 'orange'; // L-shape
        case JSON.stringify([[1, 1, 1], [0, 0, 1]]): return 'blue'; // J-shape
        default: return 'grey';
    }
};

const boardWidth = 10;
const boardHeight = 20;

function GameScreen() {
    const [board, setBoard] = useState(
        Array.from({ length: boardHeight }, () => Array(boardWidth).fill(0))
    );
    const [landedBlocks, setLandedBlocks] = useState(
        Array.from({ length: boardHeight }, () => Array(boardWidth).fill(null))
    );

    const generateTetromino = () => {
        const shape = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
        return {
            shape,
            position: { x: 4, y: 0 },
            color: getTetrominoColor(shape),
        };
    };

    const resetTetromino = useCallback(() => generateTetromino(), []);
    const [activeTetromino, setActiveTetromino] = useState(generateTetromino);

    const [speed, setSpeed] = useState(500);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const checkCollision = useCallback((shape, position) => {
        return shape.some((row, rowIndex) =>
            row.some((cell, colIndex) => {
                if (cell > 0) {
                    const x = position.x + colIndex;
                    const y = position.y + rowIndex;
                    if (
                        y >= boardHeight ||
                        x < 0 ||
                        x >= boardWidth ||
                        landedBlocks[y]?.[x] > 0
                    ) {
                        return true;
                    }
                }
                return false;
            })
        );
    }, [landedBlocks]);

    const checkAndClearRows = useCallback((blocks) => {
        let clearedRows = 0;
        const updatedBlocks = blocks.filter((row) => {
            if (row.every((cell) => cell > 0)) {
                clearedRows ++;
                return false;
            }
            return true;
        });
        while (updatedBlocks.length < boardHeight) {
            updatedBlocks.unshift(Array(boardWidth).fill(0));
        }
       setLandedBlocks(updatedBlocks);
       setScore((prevScore) => prevScore + clearedRows * 100);

       return { updatedBlocks, clearedRows };
    }, []);

    const handleTetrominoLand = useCallback((position, shape, color) => {
        // Define a new color for the landed tetromino
        const landedColor = '#ccc'; // Example: Change to a light grey color or any other color you like

        // Create a deep copy of landedBlocks to avoid mutating state directly
        const newLandedBlocks = landedBlocks.map((row) => [...row]);

        // Update only the cells where the tetromino exists
        shape.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell > 0) {
                    const x = position.x + colIndex;
                    const y = position.y + rowIndex;
                    if (y >= 0 && y < boardHeight && x >= 0 && x < boardWidth) {
                        newLandedBlocks[y][x] = landedColor; // Use the new landed color
                    }
                }
            });
        });

        // Check for and clear completed rows
        const { updatedBlocks, clearedRows } = checkAndClearRows(newLandedBlocks);
        setLandedBlocks(updatedBlocks);

        // Update the score based on cleared rows
        setScore((prev) => prev + clearedRows * 100);
    }, [landedBlocks, checkAndClearRows]);


    const placeTetromino = useCallback((shape, position) => {
        const newBlocks = landedBlocks.map((row) => [...row]);
        shape.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell > 0) {
                    const x = position.x + colIndex;
                    const y = position.y + rowIndex;
                    if (y >= 0 && y < boardHeight && x >= 0 && x < boardWidth) {
                        newBlocks[y][x] = 1;
                    }
                }
            });
        });
        setLandedBlocks(newBlocks);
        checkAndClearRows(newBlocks);

        return {landedBlocks, checkAndClearRows};
    }, [checkAndClearRows, landedBlocks]);

    const moveDown = useCallback(() => {
        setActiveTetromino((prev) => {
            const newPosition = { ...prev.position, y: prev.position.y + 1 };
            if (checkCollision(prev.shape, newPosition)) {
                handleTetrominoLand(prev.position, prev.shape, prev.color);
                placeTetromino(prev.shape, prev.position);

                const newTetromino = resetTetromino();
                if (checkCollision(newTetromino.shape, newTetromino.position)) {
                  setGameOver(true);
                }
                return newTetromino;
            }

            return { ...prev, position: newPosition };
        });
    }, [checkCollision, placeTetromino, resetTetromino, handleTetrominoLand]);

    const rotateShape = (shape) => {
        return shape[0].map((_, colIndex) => shape.map(row => row[colIndex]).reverse());
    };


        const handleKeyPress = useCallback((event) => {
            const { shape, position } = activeTetromino;
            if (event.key === "ArrowLeft") {
                const nextPosition = { ...position, x: position.x - 1 };
                if (!checkCollision(shape, nextPosition))
                    setActiveTetromino({ ...activeTetromino, position: nextPosition });
            } else if (event.key === "ArrowRight") {
                const nextPosition = { ...position, x: position.x + 1 };
                if (!checkCollision(shape, nextPosition))
                    setActiveTetromino({ ...activeTetromino, position: nextPosition });
            } else if (event.key === "ArrowUp") {
                const rotatedShape = rotateShape(shape);
                if (!checkCollision(rotatedShape, position))
                    setActiveTetromino({ ...activeTetromino, shape: rotatedShape });
            } else if (event.key === "ArrowDown") {
                //accelerate downward movement
                moveDown();
            } else if (event.key === " ") {
                //hard drop: move tetromino all the way down
                let tempPosition = { ...position };
                while (!checkCollision(shape, { ...tempPosition,
                    y: tempPosition.y + 1,
                })) {
                    tempPosition.y += 1;
                }
                handleTetrominoLand(tempPosition, shape);
                placeTetromino(shape, tempPosition);
                setActiveTetromino(resetTetromino());
            }
        }, [activeTetromino, handleTetrominoLand, checkCollision, moveDown, placeTetromino, resetTetromino]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [handleKeyPress]);

    const updateTetromino = useCallback(() => {
        setActiveTetromino((prev) => {
            const newPosition = { ...prev.position, y: prev.position.y + 1};
            if (checkCollision(prev.shape, newPosition)) {
                handleTetrominoLand(prev.position, prev.shape);
                placeTetromino(prev.shape, prev.position);
                const newTetromino = resetTetromino();
                if (checkCollision(newTetromino.shape, newTetromino.position)) {
                    setGameOver(true);
                }
                return newTetromino;
            }
            return { ...prev, position: newPosition};
        });
    }, [checkCollision, handleTetrominoLand, placeTetromino, resetTetromino, setGameOver]);



    useEffect(() => {
        if (!gameOver) {
            const interval = setInterval(updateTetromino, speed); //adjust speed
            return () => clearInterval(interval); //cleanup interval on
        }
    }, [updateTetromino, speed, gameOver]);

    const restartGame = () => {
        // Reset the board and landedBlocks with the correct initial state
        setBoard(Array.from({ length: boardHeight }, () => Array(boardWidth).fill(0)));
        setLandedBlocks(Array.from({ length: boardHeight }, () => Array(boardWidth).fill(null)));

        // Reset other game states
        setScore(0);
        setActiveTetromino(resetTetromino());
        setGameOver(false);
    };


    return (
        <div className="game-container">
            <div className="board"
                style={{
                    position: 'relative',
                    width: boardWidth * 20,
                    height: boardHeight * 20,
                    backgroundColor: 'black',
                    border: '2px solid grey',
                }}
            >
                {landedBlocks.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            cell && (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    style={{
                                        position: 'absolute',
                                        top:  rowIndex * 20,
                                        left: colIndex * 20,
                                        width: 20,
                                        height: 20,
                                        backgroundColor: cell || 'transparent',
                                        border: '1px solid #ddd',

                                    }}
                                ></div>
                            )
                        )
                    )
            )}
                <Tetromino position={activeTetromino.position} shape={activeTetromino.shape} color={activeTetromino.color} />
            </div>
            <div className="sidebar">
                <h2>Score: {score}</h2>
                {gameOver ? (
                    <button onClick={restartGame}>Restart</button>
                ) : (
                    <button onClick={() => setGameOver(true)}>Quit</button>
                )}
            </div>
        </div>
    );
}

export default GameScreen;

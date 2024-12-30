import React, { useState, useEffect } from 'react';

const TETROMINOES = [
    [[1, 1, 1], [0, 1, 0]], // T-shape
    [[1, 1], [1, 1]],       // O-shape
    [[1, 1, 1, 1]],         // I-shape
    [[1, 1, 0], [0, 1, 1]], // Z-shape
    [[0, 1, 1], [1, 1, 0]], // S-shape
    [[1, 1, 1], [1, 0, 0]], // L-shape
    [[1, 1, 1], [0, 0, 1]], // J-shape
];

function Tetromino({ onLand, boardWidth, landedBlocks }) {
    const [position, setPosition] = useState({ x: Math.floor(boardWidth / 2), y: 0});
    const [rotation, setRotation] = useState(0);
    const [shape, setShape] = useState(TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)]);
    const [speed, setSpeed] = useState(500);
    const [intervalId, setIntervalId] = useState(null);

    const rotateShape = (shape) => {
        return shape[0].map((_, colIndex) =>
            shape.map((row) => row[colIndex]).reverse()
        );
    };

    const checkCollision = (landedBlocks, position, shape) => {
        return shape.some((row, rowIndex) =>
            row.some(
                (cell, colIndex) => {
                    const x = position.x + colIndex;
                    const y = position.y + rowIndex;

                    //Check if the cell is outside the bottom boundary
                    if (cell > 0 && (x < 0 || x >= boardWidth || y >= 20)) return true;

                    //Check collision with landed blocks
                    return (
                        cell > 0 &&
                        landedBlocks.some((block) =>
                            block.shape.some((blockRow, bRowIndex) =>
                                blockRow.some(
                                    (bCell, bColIndex) =>
                                        bCell > 0 &&
                                        block.position.x + bColIndex === x &&
                                        block.position.y + bRowIndex === y
                                )
                            )
                        )
                    );
                })
        );
    };

    //Move the tetromino down
    const moveTertrominoDown = () => {
        setPosition((prev) => {
            const nextPosition = { ...prev, y: prev.y + 1 };

            if (checkCollision(landedBlocks, nextPosition, shape)) {
                //Defer the landing callback to prevent state updates during
                setTimeout(() => {
                    onLand(prev, shape); //Trigger Landing
                }, 0);
                setShape(TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)]);
                return {x: Math.floor(boardWidth / 2), y: 0 }; //reset position
            }

            return nextPosition; //move down
        });
    };

    useEffect(() => {
        const interval = setInterval(moveTertrominoDown, speed); //adjust speed
        setIntervalId(interval);

        return () => clearInterval(interval); //cleanup interval on
    }, [landedBlocks, shape, speed]);

    // Keypress handling for movement
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === "ArrowLeft") {
                setPosition((prev) => {
                    const nextPosition = { ...prev, x: prev.x - 1 };
                    return checkCollision(landedBlocks, nextPosition, shape) ? prev : nextPosition;
                });
            } else if (event.key === "ArrowRight") {
                setPosition((prev) => {
                    const nextPosition = { ...prev, x: prev.x + 1};
                    return checkCollision(landedBlocks, nextPosition, shape) ? prev : nextPosition;
                });
            } else if (event.key === "ArrowUp") {
                const rotatedShape = rotateShape(shape);
                if (!checkCollision(landedBlocks, position, rotatedShape)) {
                    setShape(rotatedShape);
                }
            } else if (event.key === "ArrowDown") {
                //accelerate downward movement
                setSpeed(200);
            } else if (event.key === " ") {
                //hard drop: move tetromino all the way down
                let tempPosition = { ...position};
                while (!checkCollision(landedBlocks, { x: tempPosition.x, y: tempPosition.y + 1}, shape)) {
                    tempPosition.y += 1;
                }
                setPosition(tempPosition);
                onLand(tempPosition, shape);
                setShape(TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)]);
            }
        };

        const handleKeyUp = (event) => {
            if (event.key === "ArrowDown") {
                setSpeed(500); //Reset fall speed
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [landedBlocks, shape, position]);

    return (
        <div className='tetromino'>
            {shape.map((row, rowIndex) =>
                row.map(
                    (cell, colIndex) => (
                        cell > 0 && (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                style={{
                                    position: 'absolute',
                                    top: (position.y + rowIndex) * 20,
                                    left: (position.x + colIndex) * 20,
                                    width: 20,
                                    height: 20,
                                    backgroundColor: 'blue', //Change for shape colors
                                }}
                            ></div>
                        )
                ))
            )}
        </div>
    );
}

export default Tetromino;


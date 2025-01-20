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
    if (shape.length === 2 && shape[0].length === 3 && shape[1][0] === 0) return 'purple'; // T-shape
    if (shape.length === 1 && shape[0].length === 4) return 'cyan'; // I-shape
    if (shape.length === 2 && shape[0].length === 2) return 'yellow'; // O-shape
    if (shape.length === 2 && shape[0][1] === 1 && shape[1][0] === 1) return 'green'; // S-shape
    if (shape.length === 2 && shape[0][0] === 1 && shape[1][1] === 1) return 'red'; // Z-shape
    if (shape.length === 2 && shape[0][0] === 1 && shape[1][0] === 1) return 'orange'; // L-shape
    if (shape.length === 2 && shape[0][1] === 1 && shape[1][1] === 1) return 'blue'; // J-shape
    return 'gray';
};

const boardWidth = 10;
const boardHeight = 20;
const blockSize = 30;
const initialSpeed = 800;
const speedIncrement = 50;
const levelThreshold = 1000;

function GameScreen() {
    const [landedBlocks, setLandedBlocks] = useState(
        Array.from({ length: boardHeight }, () => Array(boardWidth).fill(0))
    );
    const isHandlingPlacement = React.useRef(false);
    const [level, setLevel] = useState(1);
    const [speed, setSpeed] = useState(initialSpeed);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const generateTetromino = useCallback(() => {
        const shape = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
        return {
            shape,
            position: { x: Math.floor((boardWidth - shape[0].length) / 2), y: 0 },
            color: getTetrominoColor(shape)
        };
    }, []);

    const [activeTetromino, setActiveTetromino] = useState(generateTetromino);
    const [nextTetromino, setNextTetromino] = useState(generateTetromino);

    const checkCollision = useCallback((shape, position) => {
        return shape.some((row, rowIndex) =>
            row.some((cell, colIndex) => {
                if (cell === 0) return false;
                    const x = position.x + colIndex;
                    const y = position.y + rowIndex;
                    return (
                        y >= boardHeight ||
                        x < 0 ||
                        x >= boardWidth ||
                        (y >= 0 && landedBlocks[y]?.[x])
                    );
                })
        );
    }, [landedBlocks]);

    const updateGridWithTetromino = useCallback((shape, position, color) => {
        const newLandedBlocks = landedBlocks.map((row) => [...row]);

        shape.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell > 0) {
                    const y = position.y + rowIndex;
                    const x = position.x + colIndex;
                    if (y >= 0 && y < boardHeight && x >= 0 && x < boardWidth) {
                        newLandedBlocks[y][x] = color;
                    }
                }
            });
        });


        let clearedRows = 0;
        const updatedBlocks = newLandedBlocks.filter(row => {
            if (row.every(cell => cell)) {
                clearedRows++;
                return false;
            }
            return true;
        });


        while (updatedBlocks.length < boardHeight) {
            updatedBlocks.unshift(Array(boardWidth).fill(0));
        }

        const newScore = score + (clearedRows * 100 * level);
        setScore(newScore);

        if (newScore >= level * levelThreshold) {
            setLevel(prevLevel => prevLevel + 1);
            setSpeed(prevSpeed => Math.max(prevSpeed - speedIncrement, 100));
        }

        setLandedBlocks(updatedBlocks);
        return { updatedBlocks, clearedRows };
    }, [landedBlocks, score, level]);


    const handleTetrominoPlacement = useCallback(() => {
        if (isHandlingPlacement.current) return;
        isHandlingPlacement.current = true;

        const { shape, position, color } = activeTetromino;
        const { updatedBlocks } = updateGridWithTetromino(shape, position, color);

        const isGameOver = updatedBlocks.slice(0, 2).some(row =>
            row.some(cell => cell !== 0)
        );

        if (isGameOver) {
            setGameOver(true);
        } else {
            const newTetromino = nextTetromino;
            setActiveTetromino(newTetromino);
            setNextTetromino(generateTetromino());

            if (checkCollision(newTetromino.shape, newTetromino.position)){
                setGameOver(true);
            }
        }

        isHandlingPlacement.current = false;
    }, [activeTetromino, nextTetromino, generateTetromino, updateGridWithTetromino, checkCollision]);

    const rotateShape = useCallback((shape) => {
        const newShape = shape[0].map((_, colIndex) =>
            shape.map(row => row[colIndex]).reverse()
        );
        return newShape;
    }, []);


    const handleKeyPress = useCallback((event) => {
        if (gameOver || isHandlingPlacement.current) return;

        if (event.key.toLowerCase() === 'p') {
            setIsPaused((prev) => !prev);
            return;
        }

        if (isPaused) return;

        const { shape, position } = activeTetromino;

        switch (event.key) {
            case 'ArrowLeft':
                const leftPosition = { ...position, x: position.x - 1 };
                if (!checkCollision(shape, leftPosition)) {
                    setActiveTetromino(prev => ({ ...prev, position: leftPosition}));
                }
                break;

            case 'ArrowRight':
                const rightPosition = { ...position, x: position.x + 1 };
                if (!checkCollision(shape, rightPosition)) {
                    setActiveTetromino(prev => ({ ...prev, position: rightPosition}));
                }
                break;

            case 'ArrowUp':
                const rotatedShape = rotateShape(shape);
                if (!checkCollision(rotatedShape, position)) {
                    setActiveTetromino(prev => ({ ...prev, shape: rotatedShape}));
                }
                break;

            case 'ArrowDown':
                const downPosition = { ...position, y: position.y + 1 };
                if (!checkCollision(shape, downPosition)) {
                    setActiveTetromino(prev => ({ ...prev, position: downPosition}));
                }
                break;

            default:
                break;
        }
    }, [activeTetromino, checkCollision, gameOver, isPaused, rotateShape]);


    useEffect(() => {
        const keyListener = (event) => handleKeyPress(event);
        window.addEventListener("keydown", keyListener);
        return () => window.removeEventListener("keydown", keyListener);
    }, [handleKeyPress]);

    useEffect(() => {
        if (!gameOver && !isPaused) {
            const interval = setInterval(() => {
                if (isHandlingPlacement.current) return;

                setActiveTetromino(prev => {
                    const newPosition = { ...prev.position, y: prev.position.y + 1};
                    if ( checkCollision(prev.shape, newPosition)) {
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
    }, [gameOver, isPaused, speed, checkCollision, handleTetrominoPlacement, nextTetromino]);


    const restartGame = () => {
        setLandedBlocks(Array.from({ length: boardHeight }, () => Array(boardWidth).fill(0)));
        setScore(0);
        setLevel(1);
        setSpeed(initialSpeed);
        setActiveTetromino(generateTetromino());
        setNextTetromino(generateTetromino());
        setGameOver(false);
        setIsPaused(false);
    };


    return (
        <div className="game-container">
            <div className="board"
                style={{
                    width: boardWidth * blockSize,
                    height: boardHeight * blockSize,
                }}
            >
                {landedBlocks.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        cell ? (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            style={{
                                position: 'absolute',
                                top: rowIndex * blockSize,
                                left: colIndex * blockSize,
                                width: blockSize - 2,
                                height: blockSize - 2,
                                backgroundColor: cell,
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        />
                    ) : null
                    ))
                )}
                <Tetromino {...activeTetromino} />
            </div>
            <div className="sidebar">
                <h2>Score: {score}</h2>
                <h3>Level: {level}</h3>
                <div className='next-piece'>
                    <h3>Next Piece:</h3>
                    <div className='next-piece-preview'>
                        <Tetromino
                            shape={nextTetromino.shape}
                            position={{ x: 0, y: 0 }}
                            color={nextTetromino.color}
                        />
                    </div>
                </div>
                {gameOver ? (
                    <button onClick={restartGame}>Restart Game</button>
                ) : (
                    <>
                        <button onClick={() => setIsPaused(!isPaused)}>
                            {isPaused ? 'Resume' : 'Pause'}
                        </button>
                        <button onClick={() => setGameOver(true)}>Quit</button>
                    </>
                )}
                {isPaused && <div className='pause-overlay'>PAUSED</div>}
            </div>
        </div>
    );
}

export default GameScreen;

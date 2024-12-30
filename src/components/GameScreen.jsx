import React, {useState, useCallback } from 'react';
import Tetromino from './Tetromino';

function Game() {
    const [landedBlocks, setLandedBlocks] = useState([]);
    const boardWidth = 10;
    const boardHeight = 20;

    const handleTetrominoLand = useCallback((position, shape) => {
        //update the board with landed tetromino
        setLandedBlocks((prevBlocks) => [...prevBlocks, { position, shape }]);
    }, []);

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
                <Tetromino
                    onLand={handleTetrominoLand}
                    boardWidth={boardWidth}
                    landedBlocks={landedBlocks}
                />
                {landedBlocks.map((block, index) =>
                    block.shape.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            cell > 0 && (
                                <div
                                    key={`${index}-${rowIndex}-${colIndex}`}
                                    style={{
                                        position: 'absolute',
                                        top: (block.position.y + rowIndex) * 20,
                                        left: (block.position.x + colIndex) * 20,
                                        width: 20,
                                        height: 20,
                                        backgroundColor: 'grey',
                                    }}
                                ></div>
                            )
                        ))
                    )
                )}
            </div>
            <div className="sidebar">
                <h2>Score: 0</h2>
                <button>Quit</button>
            </div>
        </div>
    );
}

export default Game;

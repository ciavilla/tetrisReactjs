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

function Tetromino({ onLand, boardWidth }) {
    const [position, setPosition] = useState({ x: Math.floor(boardWidth / 2), y: 0});

    const shape = useState(TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)]);

    //Move the tetromino down
    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((prev) => ({ ...prev, y: prev.y + 1}));
        }, 500); // Adjust the speed as needed

        return () => clearInterval(interval);
    }, []);

    //Check if tetromino landed
    useEffect(() => {
        //simple placeholder for collision detection
        if (position.y >18) {   //Assume 20 rows; adjust as needed
            onLand(position, shape);
            setPosition({ x: Math.floor(boardWidth / 2), y: 0}); //Reset position
        }
    }, [position, onLand, shape, boardWidth]);

    return (
        <div className='tetromino'>
            {shape.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    cell > 0 && (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            style={{
                                position: 'abaolute',
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


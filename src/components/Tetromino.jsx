import React from 'react';


function Tetromino({ position, shape, color }) {
    const blockSize = 30;

    return (
        <div className="tetromino">
            {shape.map((row, rowIndex) =>
                row.map(
                    (cell, colIndex) =>
                        cell ? (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                style={{
                                    position: 'absolute',
                                    top: (position.y + rowIndex) * blockSize,
                                    left: (position.x + colIndex) * blockSize,
                                    width: blockSize - 2,
                                    height: blockSize - 2,
                                    backgroundColor: color,
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    boxShadow: 'inset 2px 2px 5px rgba(255, 255, 255, 0.4)'
                                }}
                            />
                        ) : null
                )
            )}
        </div>
    );
}

export default Tetromino;


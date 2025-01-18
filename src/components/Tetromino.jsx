import React from 'react';


function Tetromino({ position, shape, color }) {

    return (
        <div className="tetromino">
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
                                    backgroundColor: color, //Change for shape colors
                                }}
                            ></div>
                        )
                ))
            )}
        </div>
    );
}

export default Tetromino;


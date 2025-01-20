
function WelcomeScreen({ onStart }) {
    return (
        <div className="welcome-screen">
            <h1>Cia's Tetris Game</h1>
            <h2>Welcome! Play My Game!</h2>
            <button onClick={onStart}>Start Game</button>
            <p>Use arrow keys to move and rotate pieces. Complete rows to score points. </p>
        </div>
    );
}

export default WelcomeScreen;

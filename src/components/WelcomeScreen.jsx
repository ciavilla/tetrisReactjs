
function WelcomeScreen({ onStart }) {
    return (
        <div className="welcome-screen">
            <h1>Tetris</h1>
            <button onClick={onStart}>Start Game</button>
            <p>Use arrow keys to move and rotate pieces. Complete rows to score points. </p>
        </div>
    );
}

export default WelcomeScreen;

import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import './App.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="App">
      {isPlaying ? <GameScreen /> : <WelcomeScreen onStart={() => setIsPlaying(true)} />}
    </div>
  );
}

export default App;

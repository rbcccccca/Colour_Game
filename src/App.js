import React, { useState } from 'react';
import FallingColorGame from './FallingColorGame';
import ColorMatcherGame from './ColorMatcherGame';
import ColorMixingGame from './ColorMixingGame'; // Import ColorMixingGame
import Home from './Home';

function App() {
  const [currentGame, setCurrentGame] = useState('home');

  const navigateToHome = () => setCurrentGame('home');
  const startFallingGame = () => setCurrentGame('falling');
  const startMatcherGame = () => setCurrentGame('matcher');
  const startColorMixingGame = () => setCurrentGame('colorMixing'); // Handler for ColorMixingGame

  return (
    <div className="App">
      {currentGame === 'home' && (
        <Home
          onStartFallingGame={startFallingGame}
          onStartMatcherGame={startMatcherGame}
          onStartColorMixingGame={startColorMixingGame} // Pass the handler to Home
        />
      )}
      {currentGame === 'falling' && (
        <FallingColorGame onHome={navigateToHome} />
      )}
      {currentGame === 'matcher' && (
        <ColorMatcherGame onHome={navigateToHome} />
      )}
      {currentGame === 'colorMixing' && (
        <ColorMixingGame onHome={navigateToHome} /> 
      )}
    </div>
  );
}

export default App;

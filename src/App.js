import React, { useState } from 'react';
import FallingColorGame from './FallingColorGame';
import ColorMatcherGame from './ColorMatcherGame';
import Home from './Home';

function App() {
  const [currentGame, setCurrentGame] = useState('home');

  const navigateToHome = () => setCurrentGame('home');
  const startFallingGame = () => setCurrentGame('falling');
  const startMatcherGame = () => setCurrentGame('matcher');

  return (
    <div className="App">
      {currentGame === 'home' && (
        <Home 
          onStartFallingGame={startFallingGame}
          onStartMatcherGame={startMatcherGame}
        />
      )}
      {currentGame === 'falling' && (
        <FallingColorGame onHome={navigateToHome} />
      )}
      {currentGame === 'matcher' && (
        <ColorMatcherGame onHome={navigateToHome} />
      )}
    </div>
  );
}

export default App;
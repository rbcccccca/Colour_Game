import React from 'react';

function Home({ onStartFallingGame, onStartMatcherGame }) {
  return (
    <div className="Home">
      <h1>Welcome to Color Games</h1>
      <button onClick={onStartFallingGame}>Play Falling Color Game</button>
      <button onClick={onStartMatcherGame}>Play Color Matcher Game</button>
    </div>
  );
}

export default Home;
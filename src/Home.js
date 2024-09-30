import React from 'react';

function Home({ onStartFallingGame, onStartMatcherGame }) {
  return (
    <div className="home">
      <h1>Color Game Series</h1>
      <button onClick={onStartFallingGame}>Play Falling Color Game</button>
      <button onClick={onStartMatcherGame}>Play Color Matcher Game</button>
    </div>
  );
}

export default Home;
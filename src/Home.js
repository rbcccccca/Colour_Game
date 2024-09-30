import React from 'react';
import './Home.css'; // Make sure to create this CSS file

function Home({ onStartFallingGame, onStartMatcherGame }) {
  return (
    <div className="home-container">
      <div className="floating-shapes">
        <div className="shape circle"></div>
        <div className="shape triangle"></div>
        <div className="shape square"></div>
        <div className="shape pentagon"></div>
      </div>
      <div className="content">
        <h1 className="title">Welcome to Color Games!</h1>
        <div className="button-container">
          <button className="game-button" onClick={onStartFallingGame}>
            Play Falling Color Game
          </button>
          <button className="game-button" onClick={onStartMatcherGame}>
            Play Color Matcher Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
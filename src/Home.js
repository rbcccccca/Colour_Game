import React from 'react';
import './Home.css';

function Home({ onStartFallingGame, onStartMatcherGame }) {
  const shapes = ['circle', 'triangle', 'square', 'pentagon', 'hexagon'];
  const colors = ['#ff69b4', '#00ced1', '#ffa500', '#9370db', '#32cd32', '#ff6347'];

  const generateShapes = () => {
    const generatedShapes = [];
    for (let i = 0; i < 30; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * (80 - 20) + 20; // Random size between 20px and 80px
      const left = Math.random() * 100; // Random left position
      const top = Math.random() * 100; // Random top position
      const animationDuration = Math.random() * (20 - 5) + 5; // Random duration between 5s and 20s

      generatedShapes.push(
        <div
          key={i}
          className={`shape ${shape}`}
          style={{
            backgroundColor: color,
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            animationDuration: `${animationDuration}s`,
          }}
        ></div>
      );
    }
    return generatedShapes;
  };

  return (
    <div className="home-container">
      <div className="floating-shapes">
        {generateShapes()}
      </div>
      <div className="content">
        <h1 className="title">Welcome to Colour Games!</h1>
        <div className="button-container">
          <button className="game-button" onClick={onStartFallingGame}>
            Play Colour Coding
          </button>
          <button className="game-button" onClick={onStartMatcherGame}>
            Play Colour Matching
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
import React, { useState, useEffect } from 'react';
import './Home.css';

function Home({ onStartFallingGame, onStartMatcherGame, onStartColorMixingGame }) { // New prop for color mixing game
  const shapes = ['circle', 'triangle', 'square', 'pentagon', 'hexagon'];
  const colors = ['#ff69b4', '#00ced1', '#ffa500', '#9370db', '#32cd32', '#ff6347'];
  const [generatedShapes, setGeneratedShapes] = useState([]);

  useEffect(() => {
    setGeneratedShapes(generateShapes());
  }, []); // Add generateShapes to the dependency array  

  const generateShapes = () => {
    const newShapes = [];
    for (let i = 0; i < 50; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * (80 - 20) + 20; // Random size between 20px and 80px
      const left = Math.random() * 100; // Random left position
      const top = Math.random() * 100; // Random top position
      const durationX = Math.random() * (15 - 5) + 5; // Random duration between 5s and 15s
      const durationY = Math.random() * (15 - 5) + 5; // Random duration between 5s and 15s
      const delayX = Math.random() * -15; // Random delay up to -15s to offset animations
      const delayY = Math.random() * -15; // Random delay up to -15s to offset animations
      const directionX = Math.random() < 0.5 ? 'alternate' : 'alternate-reverse';
      const directionY = Math.random() < 0.5 ? 'alternate' : 'alternate-reverse';

      newShapes.push(
        <div
          key={i}
          className={`shape ${shape}`}
          style={{
            backgroundColor: color,
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            animationName: 'floatX, floatY',
            animationDuration: `${durationX}s, ${durationY}s`,
            animationTimingFunction: 'ease-in-out, ease-in-out',
            animationIterationCount: 'infinite, infinite',
            animationDirection: `${directionX}, ${directionY}`,
            animationDelay: `${delayX}s, ${delayY}s`,
          }}
        ></div>
      );
    }
    return newShapes;
  };

  return (
    <div className="home-container">
      <div className="floating-shapes">
        {generatedShapes}
      </div>
      <div className="content">
        <h1 className="title">Welcome to Colour Games!</h1>
        <div className="button-container">
          <button className="game-button" onClick={onStartFallingGame}>
            #000000 Coding
          </button>
          <button className="game-button" onClick={onStartMatcherGame}>
            ?= Matching
          </button>
          <button className="game-button" onClick={onStartColorMixingGame}>  {/* New button for Color Mixing Game */}
            @@@@ Mixing
          </button>
        </div>
      </div>
      <div className="credit">
        Developed using AI Claude 3.5 • Designed by Roujia Feng •{' '}
        <a href="https://github.com/rbcccccca/Colour_Game" target="_blank" rel="noopener noreferrer" className="github-link">
          GitHub
        </a>
      </div>

      {/* Info Button and Acknowledgment Section */}
      <div className="info-button-container">
        <button className="info-button">i</button>
        <div className="acknowledgement">
          <h3>Acknowledgement</h3>
          <p>
            I would like to thank my family, friends, and tutor for their support in optimising this game.
          </p>
          <p>
          Special thanks to: Sijia, Marvin, Tin Lok, Natasha, and Brie.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;

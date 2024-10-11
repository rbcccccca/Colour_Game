import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from './components/ui/button'; // Assuming you have a Button component
import { Eye, Play, Pause, RefreshCw, Home } from 'lucide-react';

interface ColorMixingGameProps {
  onHome: () => void;
}

// Generate a random RGB color
const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return { r, g, b };
};

// Convert RGB to HEX
const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
};

// Convert RGB to CMYK using the provided formula
const rgbToCmyk = (r: number, g: number, b: number) => {
  const rPrime = r / 255;
  const gPrime = g / 255;
  const bPrime = b / 255;

  const k = 1 - Math.max(rPrime, gPrime, bPrime);
  
  // Prevent division by zero for cases when K equals 1
  const c = (1 - rPrime - k) / (1 - k) || 0;
  const m = (1 - gPrime - k) / (1 - k) || 0;
  const y = (1 - bPrime - k) / (1 - k) || 0;

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
};

// Convert CMYK to RGB
const cmykToRgb = (c: number, m: number, y: number, k: number) => {
  const r = 255 * (1 - c / 100) * (1 - k / 100);
  const g = 255 * (1 - m / 100) * (1 - k / 100);
  const b = 255 * (1 - y / 100) * (1 - k / 100);
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
};

const ColorMixingGame: React.FC<ColorMixingGameProps> = ({ onHome }) => {
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [mixedColor, setMixedColor] = useState({ c: 0, m: 0, y: 0, k: 0 });
  const [timeLeft, setTimeLeft] = useState(600);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showGreenTick, setShowGreenTick] = useState(false);
  const [colorMatchPercentage, setColorMatchPercentage] = useState(0);


  const intervalId = useRef<NodeJS.Timeout | null>(null);

  // Function to start or restart the game
  const startGame = useCallback(() => {
    setGameActive(true);
    setGamePaused(false);
    setScore(0);
    setTimeLeft(600);
    setTargetColor(generateRandomColor());
    setMixedColor({ c: 0, m: 0, y: 0, k: 0 });
    setShowHint(false); // Reset hint on game restart
  }, []);

  // Function to handle button press (increase/decrease color)
  const adjustColor = (color: 'c' | 'm' | 'y' | 'k', amount: number) => {
    setMixedColor(prev => {
      const newValue = Math.min(255, Math.max(0, prev[color] + amount));
      return { ...prev, [color]: newValue };
    });
  };

  // Long press functionality
  const startAdjustingColor = (color: 'c' | 'm' | 'y' | 'k', amount: number) => {
    adjustColor(color, amount); // Adjust once immediately
    intervalId.current = setInterval(() => adjustColor(color, amount), 100); // Adjust repeatedly every 100ms
  };

  const stopAdjustingColor = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
  };

  // Handle input changes directly
  const handleInputChange = (color: 'c' | 'm' | 'y' | 'k', value: number) => {
    setMixedColor(prev => ({
      ...prev,
      [color]: Math.min(255, Math.max(0, value)) // Ensure the value stays between 0 and 255
    }));
  };

  // Helper function to compare two values with a tolerance
  const isCloseEnough = (a: number, b: number, tolerance: number = 2) => {
    return Math.abs(a - b) <= tolerance;
  };

  // Check if mixed color matches the target color using tolerance for CMYK values
  const checkColorMatch = useCallback(() => {
    const { c: mixedC, m: mixedM, y: mixedY, k: mixedK } = mixedColor;

    // Convert target RGB to CMYK for comparison
    const targetCmyk = rgbToCmyk(targetColor.r, targetColor.g, targetColor.b);
    const { c: targetC, m: targetM, y: targetY, k: targetK } = targetCmyk;

    // Check if each CMYK component is close enough with a tolerance
    if (
      isCloseEnough(mixedC, targetC) &&
      isCloseEnough(mixedM, targetM) &&
      isCloseEnough(mixedY, targetY) &&
      isCloseEnough(mixedK, targetK)
    ) {
      setScore(prev => prev + 1);
      setTargetColor(generateRandomColor());
      setMixedColor({ c: 0, m: 0, y: 0, k: 0 });
      setShowGreenTick(true);
      setTimeout(() => setShowGreenTick(false), 1000); // Hide after 1 second
      setColorMatchPercentage(0); // Reset match percentage for new color
    }
  }, [mixedColor, targetColor]);

  // Function to calculate color match percentage
  const calculateColorMatchPercentage = useCallback(() => {
    const { c: mixedC, m: mixedM, y: mixedY, k: mixedK } = mixedColor;
    const targetCmyk = rgbToCmyk(targetColor.r, targetColor.g, targetColor.b);
    const { c: targetC, m: targetM, y: targetY, k: targetK } = targetCmyk;

    const cDiff = Math.abs(mixedC - targetC);
    const mDiff = Math.abs(mixedM - targetM);
    const yDiff = Math.abs(mixedY - targetY);
    const kDiff = Math.abs(mixedK - targetK);

    const totalDiff = cDiff + mDiff + yDiff + kDiff;
    const maxPossibleDiff = 400; // 100 for each CMYK component

    const matchPercentage = 100 - (totalDiff / maxPossibleDiff) * 100;
    setColorMatchPercentage(Math.round(matchPercentage));
  }, [mixedColor, targetColor]);  

  // Handle Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && !gamePaused && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setGameActive(false); // End game when timer runs out
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive, gamePaused]);

  useEffect(() => {
    if (gameActive && !gamePaused) {
      checkColorMatch();
    }
  }, [mixedColor, gameActive, gamePaused, checkColorMatch]);

  // Update color match percentage whenever mixed color changes
  useEffect(() => {
    if (gameActive && !gamePaused) {
      calculateColorMatchPercentage();
    }
  }, [mixedColor, gameActive, gamePaused, calculateColorMatchPercentage]);

  const togglePause = () => {
    setGamePaused(!gamePaused);
  };

  const toggleHint = () => {
    setShowHint(!showHint); // Toggle the visibility of the CMYK hint
  };

  const backgroundCmyk = rgbToCmyk(targetColor.r, targetColor.g, targetColor.b); // Convert target RGB to CMYK

  return (
    <div className="w-full h-screen flex flex-col items-center justify-between relative overflow-hidden"
         style={{ backgroundColor: rgbToHex(targetColor.r, targetColor.g, targetColor.b) }}> {/* Random background color */}
      
      {/* Top bar with time, score, and hint button */}
      <div className="z-10 bg-white bg-opacity-80 px-4 py-2 rounded-b-lg shadow-lg absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <div className="flex items-center">
          <p className="mr-4">Time: {timeLeft}s</p>
          <p className="mr-4">Score: {score}</p>
          <p className="mr-4">Match: {colorMatchPercentage}%</p>
          {gameActive && (
            <Button onClick={togglePause} variant="outline" size="sm">
              {gamePaused ? <Play size={16} /> : <Pause size={16} />}
            </Button>
          )}
          <Button onClick={toggleHint} variant="outline" size="sm" className="ml-4">
            {showHint ? <Eye size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        {/* CMYK Hint (shows only when showHint is true) */}
        {showHint && (
          <div className="mt-2 text-sm text-gray-700">
            Hint (CMYK): C: {backgroundCmyk.c}, M: {backgroundCmyk.m}, Y: {backgroundCmyk.y} K: {backgroundCmyk.k}
          </div>
        )}
      </div>

      {/* Monitor showing the mixed color */}
      <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/5 aspect-square">
        <div
          className="w-full h-full rounded-lg shadow-lg flex items-center justify-center"
          style={{
            backgroundColor: (() => {
              const { r, g, b } = cmykToRgb(mixedColor.c, mixedColor.m, mixedColor.y, mixedColor.k);
              return rgbToHex(r, g, b);
            })(),
          }}
        >
        </div>
      </div>




      {/* Color adjustment buttons */}
      <div className="absolute bottom-0 w-full flex justify-around">
        {(['c', 'm', 'y', 'k'] as Array<'c' | 'm' | 'y' | 'k'>).map((color) => (
          <div key={color} className="flex flex-col items-center">
          <input
            type="number"
            value={mixedColor[color]}
            onChange={(e) => handleInputChange(color, Number(e.target.value))}
            className="mb-2 w-40 h-8 text-left rounded-lg bg-black bg-opacity-50 pl-2" // Semi-transparent background
            min={0}
            max={255}
          />
          <div className="h-40 w-14 rounded-lg relative overflow-hidden">
            <div
              className="w-full absolute bottom-0"
              style={{
                height: `${(mixedColor[color] / 255) * 100}%`,
                backgroundColor: 
                  color === 'c' ? '#00FFFF' :   // Cyan
                  color === 'm' ? '#FF00FF' :   // Magenta
                  color === 'y' ? '#FFFF00' :   // Yellow
                  color === 'k' ? '#000000' :   // Black
                  'transparent',                // Default in case color is none of the above
              }}
            />
          </div>


            <div className="flex justify-center space-x-1 mb-10"> {/* Flex for side-by-side layout and margin */}
              <Button
                onMouseDown={() => startAdjustingColor(color, -1)}
                onMouseUp={stopAdjustingColor}
                onMouseLeave={stopAdjustingColor}
                className="border-black w-20 h-10" // Ensure equal width
              >
                - {color.toUpperCase()}
              </Button>
              <Button
                onMouseDown={() => startAdjustingColor(color, 1)}
                onMouseUp={stopAdjustingColor}
                onMouseLeave={stopAdjustingColor}
                className="border-black w-20 h-10" // Ensure equal width
              >
                + {color.toUpperCase()}
              </Button>

            </div>



          </div>
        ))}
      </div>

      {showGreenTick && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="text-green-800 w-30 h-30 opacity-90 transition-opacity duration-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Overlay for Pause Menu */}
      {(!gameActive || gamePaused) && (
        <div className="z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-4 rounded-lg shadow-lg">
          <div className="flex flex-col items-center">
            {!gameActive && (
              <Button onClick={startGame} className="mb-2">
                <Play className="mr-2" />
                Start Game
              </Button>
            )}
            {gamePaused && (
              <>
                <Button onClick={togglePause} className="mb-2">
                  <Play className="mr-2" />
                  Resume
                </Button>
                <Button onClick={startGame} className="mb-2">
                  <RefreshCw className="mr-2" />
                  Restart
                </Button>
              </>
            )}
            <Button onClick={onHome}>
              <Home className="mr-2" />
              Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorMixingGame;

import React, { useState, useEffect, useCallback } from 'react';
import { Slider } from './components/ui/slider';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Play, Pause, RefreshCw, Home, Eye, EyeOff, Check } from 'lucide-react'; // Add the Check icon

const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
};

interface ColorMatcherGameProps {
  onHome: () => void;
}

const ColorMatcherGame: React.FC<ColorMatcherGameProps> = ({ onHome }) => {
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [userColor, setUserColor] = useState({ r: 128, g: 128, b: 128 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [showHint, setShowHint] = useState(false); // New state for hint visibility
  const [showTick, setShowTick] = useState(false); // State for showing the tick icon

  const startGame = useCallback(() => {
    setGameActive(true);
    setGamePaused(false);
    setScore(0);
    setTimeLeft(120);
    setTargetColor(generateRandomColor());
    setUserColor({ r: 128, g: 128, b: 128 });
    setShowHint(false); // Reset hint when the game starts
    setShowTick(false); // Reset tick visibility when the game starts
  }, []);

  const checkColor = useCallback(() => {
    if (
      userColor.r === targetColor.r &&
      userColor.g === targetColor.g &&
      userColor.b === targetColor.b
    ) {
      setScore(prevScore => prevScore + 1);
      setTargetColor(generateRandomColor());
      setShowTick(true); // Show the tick icon
      setTimeout(() => setShowTick(false), 1000); // Hide the tick after 1 second
    }
  }, [userColor, targetColor]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && !gamePaused && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive, gamePaused]);

  useEffect(() => {
    if (gameActive && !gamePaused) {
      checkColor();
    }
  }, [userColor, gameActive, gamePaused, checkColor]);

  const handleSliderChange = (color: 'r' | 'g' | 'b', value: number[]) => {
    setUserColor(prev => ({ ...prev, [color]: value[0] }));
  };

  const handleInputChange = (color: 'r' | 'g' | 'b', value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
      setUserColor(prev => ({ ...prev, [color]: numValue }));
    }
  };

  const togglePause = () => {
    setGamePaused(!gamePaused);
  };

  const toggleHint = () => {
    setShowHint(!showHint); // Toggle hint visibility
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-between relative overflow-hidden" 
         style={{ backgroundColor: rgbToHex(targetColor.r, targetColor.g, targetColor.b) }}>
      
      {/* Top bar with time, score, and hint */}
      <div className="z-10 bg-white bg-opacity-80 px-4 py-2 rounded-b-lg shadow-lg absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <div className="flex items-center">
          <p className="mr-4">Time: {timeLeft}s</p>
          <p className="mr-4">Score: {score}</p>
          {gameActive && (
            <Button onClick={togglePause} variant="outline" size="sm">
              {gamePaused ? <Play size={16} /> : <Pause size={16} />}
            </Button>
          )}
          <Button onClick={toggleHint} variant="outline" size="sm" className="ml-4">
            {showHint ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        {/* Show the RGB values as a hint below the timer */}
        {showHint && (
          <div className="mt-2 text-sm">
            Target RGB: R: {targetColor.r}, G: {targetColor.g}, B: {targetColor.b}
          </div>
        )}
      </div>

      {/* Tick icon that appears when the player gets a color right */}
      {showTick && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 transition-opacity duration-1000 ease-out">
          <Check size={64} color="green" />
        </div>
      )}

      {/* Central square monitor display */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 aspect-square">
        <div className="w-full h-full bg-gray-800 rounded-lg shadow-lg flex items-center justify-center">
            <div className="w-full h-full rounded" style={{ backgroundColor: rgbToHex(userColor.r, userColor.g, userColor.b) }}></div>
        </div>
      </div>

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
      
      {/* Bottom control bar */}
      <div className="z-10 bg-white bg-opacity-80 p-4 rounded-t-lg shadow-lg w-full max-w-6xl absolute bottom-0 left-1/2 transform -translate-x-1/2">
        {gameActive && !gamePaused && (
          <div className="flex justify-between items-end">
            <div className="flex-1 mr-4">
                <label className="block mb-1 text-lg font-bold">Red</label>
                <div className="flex items-center">

                    <Slider
                    value={[userColor.r]}
                    min={0}
                    max={255}
                    step={1}
                    onValueChange={(value) => handleSliderChange('r', value)}
                    className="flex-grow mr-2"
                    />
                    <Input
                    type="number"
                    value={userColor.r}
                    onChange={(e) => handleInputChange('r', e.target.value)}
                    className="w-25 h-15 text-lg font-bold"
                    min={0}
                    max={255}
                    />
                </div>
            </div>

            
            <div className="flex-1 mr-4">
                <label className="block mb-1 text-lg font-bold">Green</label>
                <div className="flex items-center">

                    <Slider
                    value={[userColor.g]}
                    min={0}
                    max={255}
                    step={1}
                    onValueChange={(value) => handleSliderChange('g', value)}
                    className="flex-grow mr-2"
                    />
                    <Input
                    type="number"
                    value={userColor.g}
                    onChange={(e) => handleInputChange('g', e.target.value)}
                    className="w-25 h-15 text-lg font-bold"
                    min={0}
                    max={255}
                    />
                </div>
            </div>

            
            <div className="flex-1">
                <label className="block mb-1 text-lg font-bold">Blue</label>
                <div className="flex items-center">

                    <Slider
                    value={[userColor.b]}
                    min={0}
                    max={255}
                    step={1}
                    onValueChange={(value) => handleSliderChange('b', value)}
                    className="flex-grow mr-2"
                    />
                    <Input
                    type="number"
                    value={userColor.b}
                    onChange={(e) => handleInputChange('b', e.target.value)}
                    className="w-25 h-15 text-lg font-bold"
                    min={0}
                    max={255}
                    />
                </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ColorMatcherGame;

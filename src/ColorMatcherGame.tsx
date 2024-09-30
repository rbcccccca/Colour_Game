import React, { useState, useEffect, useCallback } from 'react';
import { Slider } from './components/ui/slider';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Play, Pause, RefreshCw, Home } from 'lucide-react';

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

  const startGame = useCallback(() => {
    setGameActive(true);
    setGamePaused(false);
    setScore(0);
    setTimeLeft(120);
    setTargetColor(generateRandomColor());
    setUserColor({ r: 128, g: 128, b: 128 });
  }, []);

  const checkColor = useCallback(() => {
    if (
      userColor.r === targetColor.r &&
      userColor.g === targetColor.g &&
      userColor.b === targetColor.b
    ) {
      setScore(prevScore => prevScore + 1);
      setTargetColor(generateRandomColor());
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

  return (
    <div className="w-full h-screen flex flex-col items-center justify-between relative overflow-hidden" 
         style={{ backgroundColor: rgbToHex(targetColor.r, targetColor.g, targetColor.b) }}>
      
      {/* Top bar with time and score */}
      <div className="z-10 bg-white bg-opacity-80 px-4 py-2 rounded-b-lg shadow-lg absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center">
        <p className="mr-4">Time: {timeLeft}s</p>
        <p className="mr-4">Score: {score}</p>
        {gameActive && (
          <Button onClick={togglePause} variant="outline" size="sm">
            {gamePaused ? <Play size={16} /> : <Pause size={16} />}
          </Button>
        )}
      </div>

      {/* Central square monitor display */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 aspect-square">
        <div className="w-full h-full bg-gray-800 rounded-lg shadow-lg flex items-center justify-center">
          <div className="w-[95%] h-[95%] rounded" style={{ backgroundColor: rgbToHex(userColor.r, userColor.g, userColor.b) }}></div>
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
      <div className="z-10 bg-white bg-opacity-80 p-4 rounded-t-lg shadow-lg w-full max-w-3xl absolute bottom-0 left-1/2 transform -translate-x-1/2">
        {gameActive && !gamePaused && (
          <div className="flex justify-between items-end">
            <div className="flex-1 mr-4">
              <label className="block mb-1 text-sm">Red</label>
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
                  className="w-14 text-sm"
                  min={0}
                  max={255}
                />
              </div>
            </div>
            
            <div className="flex-1 mr-4">
              <label className="block mb-1 text-sm">Green</label>
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
                  className="w-14 text-sm"
                  min={0}
                  max={255}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block mb-1 text-sm">Blue</label>
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
                  className="w-14 text-sm"
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
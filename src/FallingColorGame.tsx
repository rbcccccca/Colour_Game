import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './components/ui/button';
import { Pause, Play, RefreshCw, Eye, ArrowLeft } from 'lucide-react';
import './Falling_Color_Game.css';  // Make sure to create this CSS file

interface FallingChar {
  char: string;
  id: string;
  position: number;
  topPosition: number;
  speed: number;
  rotation: number;
  isClicked: boolean;
}

const generateRandomColor = () => {
  return Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
};

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
};

const rgbToHex = (r: number, g: number, b: number) => {
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const getComplementaryColor = (hex: string) => {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(255 - r, 255 - g, 255 - b);
};

const FallingColorGame: React.FC = () => {
  const [currentColor, setCurrentColor] = useState('');
  const [complementaryColor, setComplementaryColor] = useState('');
  const [fallingChars, setFallingChars] = useState<FallingChar[]>([]);
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [level, setLevel] = useState(1);
  const [showColorCode, setShowColorCode] = useState(false);
  const [clickedChar, setClickedChar] = useState<string | null>(null);

  const newRound = useCallback(() => {
    const color = generateRandomColor();
    setCurrentColor(color);
    setComplementaryColor(getComplementaryColor(color));
    setUserGuess('');
    setFeedback('');
    setShowColorCode(false);
    
    const chars: FallingChar[] = [];
    for (let i = 0; i < 18; i++) {
      const char = color[i % 6];
      chars.push({
        char,
        id: `${char}-${i}-${Date.now()}`,
        position: Math.random() * 90 + 5,
        topPosition: Math.random() * 80,
        speed: 0.2 + Math.random() * 0.3,
        rotation: Math.random() * 360,
        isClicked: false,
      });
    }
    setFallingChars(chars);
  }, []);

  const startGame = useCallback(() => {
    setGameActive(true);
    setGamePaused(false);
    setScore(0);
    setTimeLeft(60);
    setLevel(1);
    newRound();
  }, [newRound]);

  const restartGame = () => {
    startGame();
  };

  const togglePause = () => {
    setGamePaused(!gamePaused);
  };

  const toggleColorCode = () => {
    setShowColorCode(!showColorCode);
  };

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
    let interval: NodeJS.Timeout;
    if (gameActive && !gamePaused) {
      interval = setInterval(() => {
        setFallingChars((prevChars: FallingChar[]) => {
          return prevChars.map(char => ({
            ...char,
            topPosition: char.topPosition + char.speed,
            rotation: (char.rotation + 0.5) % 360,
            ...(char.topPosition > 100 && {
              topPosition: 0,
              position: Math.random() * 90 + 5,
            }),
          }));
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [gameActive, gamePaused]);

  const handleCharClick = (char: string, id: string) => {
    if (gamePaused) return;
    if (userGuess.length < 6) {
      setUserGuess(prevGuess => prevGuess + char);
      setClickedChar(char);
      setTimeout(() => setClickedChar(null), 1000);
      
      setFallingChars(prevChars => 
        prevChars.map(c => 
          c.id === id ? { ...c, isClicked: true } : c
        )
      );
      
      setTimeout(() => {
        setFallingChars(prevChars => 
          prevChars.map(c => 
            c.id === id ? { ...c, isClicked: false } : c
          )
        );
      }, 1000);
      
      if (userGuess.length === 5) {
        const finalGuess = userGuess + char;
        if (finalGuess === currentColor) {
          setScore(prevScore => prevScore + 1);
          setFeedback('Correct! Great job!');
          if (score + 1 >= level * 5) {
            setLevel(prevLevel => prevLevel + 1);
          }
        } else {
          setFeedback(`Incorrect. The correct color was #${currentColor}`);
        }
        setTimeout(() => {
          newRound();
        }, 2000);
      }
    }
  };

  const handleDelete = () => {
    if (userGuess.length > 0) {
      setUserGuess(prevGuess => prevGuess.slice(0, -1));
    }
  };

  const renderChar = (char: string) => {
    if (char === '6' || char === '9') {
      return (
        <span className="relative">
          {char}
          <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-current"></span>
        </span>
      );
    }
    return char;
  };

  return (
    <div className="w-full h-screen relative overflow-hidden" style={{ backgroundColor: `#${currentColor}` }}>
      <div className="absolute top-0 right-0 p-4 flex items-center">
        {gameActive && !gamePaused && (
          <>
            <Button onClick={toggleColorCode} className="mr-2" variant="outline">
              <Eye size={24} />
            </Button>
            <Button onClick={togglePause} className="mr-2" variant="outline">
              <Pause size={24} />
            </Button>
          </>
        )}
        <Button onClick={restartGame} variant="outline" className="mr-2">
          <RefreshCw size={24} />
        </Button>
        {!gameActive && (
          <Button onClick={startGame} variant="outline">
            Start Game
          </Button>
        )}
      </div>
      
      {gameActive && (
        <>
          <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-4">
            <div>Time left: {timeLeft}s | Score: {score} | Level: {level}</div>
            {showColorCode && (
              <div className="mt-2">Current Color: #{currentColor}</div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6">
            <div className="mb-4 flex items-center justify-center">
              <span className="mr-4 text-2xl font-bold">Your guess: {userGuess}</span>
              {userGuess.length > 0 && (
                <Button 
                  onClick={handleDelete} 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent hover:bg-red-500 text-white"
                >
                  <ArrowLeft size={24} />
                </Button>
              )}
            </div>
            <div className="text-center font-bold text-xl">{feedback}</div>
          </div>
          {fallingChars.map((charObj) => (
            <div
              key={charObj.id}
              className={`absolute text-4xl font-bold cursor-pointer select-none transition-all duration-300 ${
                charObj.isClicked ? 'text-5xl brightness-150' : ''
              }`}
              style={{
                left: `${charObj.position}%`,
                top: `${charObj.topPosition}%`,
                transform: `translate(-50%, -50%) rotate(${charObj.rotation}deg)`,
                color: `#${complementaryColor}`,
                textShadow: `0 0 5px #${currentColor}`,
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => handleCharClick(charObj.char, charObj.id)}
            >
              {renderChar(charObj.char)}
            </div>
          ))}
          {clickedChar && (
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-bold opacity-0 animate-fade-out"
              style={{
                color: `#${complementaryColor}`,
                textShadow: `0 0 10px #${currentColor}`,
                animation: 'fadeOut 1s forwards',
              }}
            >
              {clickedChar}
            </div>
          )}
          {gamePaused && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
              <div className="flex flex-col items-center">
                <Button onClick={togglePause} className="mb-4" variant="outline" size="lg">
                  <Play size={32} />
                </Button>
                <Button onClick={restartGame} variant="outline" size="lg">
                  <RefreshCw size={32} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FallingColorGame;
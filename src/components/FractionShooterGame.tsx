import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Target, Trophy, RotateCcw, Play } from "lucide-react";
import { toast } from "sonner";

interface Balloon {
  id: string;
  fraction: string;
  value: number;
  x: number;
  y: number;
  speed: number;
  color: string;
}

interface FractionShooterGameProps {
  subject: any;
  onBack: () => void;
  onComplete: (score: number, points: number) => void;
}

const FractionShooterGame = ({ subject, onBack, onComplete }: FractionShooterGameProps) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'levelComplete'>('menu');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [targetFraction, setTargetFraction] = useState<{ display: string; value: number }>({ display: '1/2', value: 0.5 });
  const [timeLeft, setTimeLeft] = useState(60);
  const [balloonsEscaped, setBalloonsEscaped] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  const levels = [
    { 
      level: 1, 
      target: { display: '1/2', value: 0.5 },
      fractions: [
        { display: '2/4', value: 0.5 }, { display: '3/6', value: 0.5 }, { display: '4/8', value: 0.5 },
        { display: '1/3', value: 0.333 }, { display: '2/3', value: 0.667 }, { display: '1/4', value: 0.25 }
      ]
    },
    { 
      level: 2, 
      target: { display: '1/3', value: 0.333 },
      fractions: [
        { display: '2/6', value: 0.333 }, { display: '3/9', value: 0.333 }, { display: '4/12', value: 0.333 },
        { display: '1/2', value: 0.5 }, { display: '2/5', value: 0.4 }, { display: '3/8', value: 0.375 }
      ]
    },
    { 
      level: 3, 
      target: { display: '5/4', value: 1.25 },
      fractions: [
        { display: '10/8', value: 1.25 }, { display: '15/12', value: 1.25 }, { display: '20/16', value: 1.25 },
        { display: '3/2', value: 1.5 }, { display: '7/4', value: 1.75 }, { display: '4/3', value: 1.333 }
      ]
    }
  ];

  const balloonColors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];

  const generateBalloon = useCallback(() => {
    const currentLevel = levels[level - 1];
    const randomFraction = currentLevel.fractions[Math.floor(Math.random() * currentLevel.fractions.length)];
    const id = Math.random().toString(36).substr(2, 9);
    
    return {
      id,
      fraction: randomFraction.display,
      value: randomFraction.value,
      x: Math.random() * 80 + 10, // 10% to 90% of width
      y: 100, // Start from bottom
      speed: Math.random() * 0.5 + 0.3, // 0.3 to 0.8 speed
      color: balloonColors[Math.floor(Math.random() * balloonColors.length)]
    };
  }, [level]);

  const startLevel = useCallback(() => {
    const currentLevel = levels[level - 1];
    setTargetFraction(currentLevel.target);
    setGameState('playing');
    setTimeLeft(60);
    setBalloons([]);
    setBalloonsEscaped(0);
  }, [level]);

  const shootBalloon = useCallback((balloonId: string) => {
    setBalloons(prev => {
      const balloon = prev.find(b => b.id === balloonId);
      if (!balloon) return prev;

      const isCorrect = Math.abs(balloon.value - targetFraction.value) < 0.01;
      
      if (isCorrect) {
        setScore(s => s + 10);
        toast.success("Correct! +10 points", { duration: 1000 });
      } else {
        setScore(s => s - 5);
        toast.error("Wrong! -5 points", { duration: 1000 });
      }

      return prev.filter(b => b.id !== balloonId);
    });
  }, [targetFraction.value]);

  const updateBalloons = useCallback(() => {
    setBalloons(prev => {
      let escaped = 0;
      const updated = prev.map(balloon => ({
        ...balloon,
        y: balloon.y - balloon.speed
      })).filter(balloon => {
        if (balloon.y < -10) {
          // Check if this was a correct balloon that escaped
          if (Math.abs(balloon.value - targetFraction.value) < 0.01) {
            escaped++;
          }
          return false;
        }
        return true;
      });

      if (escaped > 0) {
        setScore(s => s - (escaped * 2));
        setBalloonsEscaped(prev => prev + escaped);
        toast.error(`${escaped} correct balloon(s) escaped! -${escaped * 2} points`, { duration: 1500 });
      }

      return updated;
    });
  }, [targetFraction.value]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      updateBalloons();
      
      // Spawn new balloons randomly
      if (Math.random() < 0.02) { // 2% chance each frame
        setBalloons(prev => [...prev, generateBalloon()]);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, updateBalloons, generateBalloon]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('levelComplete');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const getCompletionMessage = () => {
    const currentLevel = levels[level - 1];
    const equivalentFractions = currentLevel.fractions
      .filter(f => Math.abs(f.value - currentLevel.target.value) < 0.01)
      .map(f => f.display)
      .join(', ');
    
    return `Great job! ${equivalentFractions} are all equal to ${currentLevel.target.display} because they have the same decimal value: ${currentLevel.target.value.toFixed(3)}`;
  };

  const nextLevel = () => {
    if (level < 3) {
      setLevel(prev => prev + 1);
      setGameState('menu');
    } else {
      onComplete(score, Math.max(0, score));
    }
  };

  const replayLevel = () => {
    setScore(0);
    setGameState('menu');
  };

  if (gameState === 'menu') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to MindPlay
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">🎯 Fraction Shooter</h1>
          <p className="text-muted-foreground text-lg">
            Shoot balloons with fractions equivalent to the target!
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Level {level}</CardTitle>
            <p className="text-muted-foreground">
              Target: <span className="text-primary font-bold text-xl">{levels[level - 1].target.display}</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Click on balloons with equivalent fractions</p>
              <p>• Correct hit: +10 points</p>
              <p>• Wrong hit: -5 points</p>
              <p>• Missed correct balloon: -2 points</p>
            </div>
            <Button onClick={startLevel} className="w-full" size="lg">
              <Play className="w-4 h-4 mr-2" />
              Start Level {level}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'levelComplete') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-4">Level {level} Complete!</h1>
          <p className="text-2xl font-semibold text-primary mb-4">Score: {score} points</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Learning Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{getCompletionMessage()}</p>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={replayLevel} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Replay Level
              </Button>
              {level < 3 ? (
                <Button onClick={nextLevel}>
                  Next Level
                </Button>
              ) : (
                <Button onClick={() => onComplete(score, Math.max(0, score))}>
                  Complete Game
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-lg font-semibold">
            Level {level} • Target: <span className="text-primary">{targetFraction.display}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold">Score: {score}</div>
          <div className="text-lg font-semibold">Time: {timeLeft}s</div>
        </div>
      </div>

      {/* Game Area */}
      <div 
        ref={gameAreaRef}
        className="relative w-full h-[600px] bg-gradient-to-b from-blue-300 via-blue-200 to-green-200 rounded-lg overflow-hidden border-4 border-primary/20"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
      >
        {/* Target Display */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-6 py-3 rounded-full shadow-lg">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold">Shoot fractions equal to {targetFraction.display}</span>
          </div>
        </div>

        {/* Balloons */}
        {balloons.map((balloon) => (
          <div
            key={balloon.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform`}
            style={{ 
              left: `${balloon.x}%`, 
              top: `${balloon.y}%`
            }}
            onClick={() => shootBalloon(balloon.id)}
          >
            <div className={`w-20 h-24 ${balloon.color} rounded-full relative shadow-lg animate-bounce`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg shadow-lg">{balloon.fraction}</span>
              </div>
              {/* Balloon string */}
              <div className="absolute bottom-0 left-1/2 w-0.5 h-8 bg-gray-400 transform -translate-x-1/2"></div>
            </div>
          </div>
        ))}

        {/* Cannon */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-3 h-8 bg-gray-800 rounded-full"></div>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-semibold">Click balloons to shoot!</p>
        </div>
      </div>
    </div>
  );
};

export default FractionShooterGame;
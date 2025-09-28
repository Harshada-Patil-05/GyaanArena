import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";

interface MemoryMatchGameProps {
  subject: any;
  onBack: () => void;
  onComplete: (score: number, points: number) => void;
}

const MemoryMatchGame = ({ subject, onBack, onComplete }: MemoryMatchGameProps) => {
  const [cards, setCards] = useState<Array<{id: number, content: string, isFlipped: boolean, isMatched: boolean}>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [timer, setTimer] = useState(0);

  const getSubjectContent = () => {
    const contents: { [key: string]: string[] } = {
      math: [
        "2+2", "4", "5×3", "15", "√16", "4", "10÷2", "5",
        "3²", "9", "8-3", "5", "6×2", "12", "20÷4", "5"
      ],
      science: [
        "H2O", "Water", "CO2", "Carbon Dioxide", "NaCl", "Salt", "O2", "Oxygen",
        "Fe", "Iron", "Au", "Gold", "Ag", "Silver", "Ca", "Calcium"
      ],
      english: [
        "Happy", "Joyful", "Big", "Large", "Fast", "Quick", "Smart", "Intelligent",
        "Sad", "Unhappy", "Small", "Tiny", "Cold", "Freezing", "Hot", "Warm"
      ],
      history: [
        "1947", "Independence", "1857", "Revolt", "Gandhi", "Mahatma", "Nehru", "Prime Minister",
        "Delhi", "Capital", "Mughal", "Empire", "British", "Colonial", "Freedom", "Liberty"
      ]
    };
    return contents[subject.id] || contents.math;
  };

  useEffect(() => {
    initializeGame();
  }, [subject]);

  useEffect(() => {
    if (gameComplete) return;
    const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [gameComplete]);

  const initializeGame = () => {
    const content = getSubjectContent();
    const gameCards = [];
    
    for (let i = 0; i < content.length; i += 2) {
      gameCards.push(
        { id: i, content: content[i], isFlipped: false, isMatched: false },
        { id: i + 1, content: content[i + 1], isFlipped: false, isMatched: false }
      );
    }
    
    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setMoves(0);
    setMatches(0);
    setGameComplete(false);
    setTimer(0);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || cards[cardId].isFlipped || cards[cardId].isMatched) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        const [first, second] = newFlippedCards;
        const content = getSubjectContent();
        
        // Check if cards match (pairs in the content array)
        let isMatch = false;
        for (let i = 0; i < content.length; i += 2) {
          if ((cards[first].content === content[i] && cards[second].content === content[i + 1]) ||
              (cards[first].content === content[i + 1] && cards[second].content === content[i])) {
            isMatch = true;
            break;
          }
        }

        if (isMatch) {
          newCards[first].isMatched = true;
          newCards[second].isMatched = true;
          setMatches(prev => prev + 1);
          
          if (matches + 1 === content.length / 2) {
            setGameComplete(true);
            const score = Math.max(100 - moves * 2, 60);
            const points = Math.floor(score * 2);
            setTimeout(() => onComplete(score, points), 1000);
          }
        } else {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
        }
        
        setCards(newCards);
        setFlippedCards([]);
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">Moves: {moves}</Badge>
          <Badge variant="secondary">Matches: {matches}</Badge>
          <Badge variant="secondary">Time: {formatTime(timer)}</Badge>
        </div>
        <Button variant="outline" onClick={initializeGame}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
      </div>

      <Card className="card-gradient">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Memory Match - {subject.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gameComplete && (
            <div className="text-center mb-6 p-4 bg-success/10 rounded-lg border border-success/20">
              <h3 className="text-lg font-bold text-success mb-2">Congratulations! 🎉</h3>
              <p className="text-muted-foreground">
                You completed the game in {moves} moves and {formatTime(timer)}!
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {cards.map((card, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className={`
                  aspect-square rounded-lg border-2 cursor-pointer transition-all duration-300
                  flex items-center justify-center text-sm font-medium
                  ${card.isMatched 
                    ? 'bg-success/20 border-success text-success cursor-default' 
                    : card.isFlipped 
                      ? 'bg-primary/20 border-primary text-primary' 
                      : 'bg-muted hover:bg-muted/80 border-border'
                  }
                  ${!card.isMatched && !card.isFlipped ? 'hover:scale-105' : ''}
                `}
              >
                {card.isFlipped || card.isMatched ? card.content : '?'}
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Click on cards to flip them. Match related pairs to score points!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryMatchGame;
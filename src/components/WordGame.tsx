import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Trophy, Lightbulb } from "lucide-react";

interface WordGameProps {
  subject: any;
  onBack: () => void;
  onComplete: (score: number, points: number) => void;
}

const WordGame = ({ subject, onBack, onComplete }: WordGameProps) => {
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timer, setTimer] = useState(0);

  const getSubjectWords = () => {
    const words: { [key: string]: Array<{word: string, hint: string}> } = {
      math: [
        { word: "ALGEBRA", hint: "Branch of mathematics dealing with symbols" },
        { word: "GEOMETRY", hint: "Study of shapes and angles" },
        { word: "FRACTION", hint: "Part of a whole number" },
        { word: "EQUATION", hint: "Mathematical statement with equals sign" },
        { word: "TRIANGLE", hint: "Three-sided polygon" },
        { word: "RECTANGLE", hint: "Four-sided shape with right angles" },
        { word: "ADDITION", hint: "Mathematical operation using plus sign" },
        { word: "MULTIPLY", hint: "Mathematical operation for repeated addition" }
      ],
      science: [
        { word: "PHOTOSYNTHESIS", hint: "Process plants use to make food" },
        { word: "GRAVITY", hint: "Force that pulls objects down" },
        { word: "MOLECULE", hint: "Smallest unit of a compound" },
        { word: "ECOSYSTEM", hint: "Community of living organisms" },
        { word: "EVOLUTION", hint: "Change in species over time" },
        { word: "ELEMENT", hint: "Pure substance on periodic table" },
        { word: "ENERGY", hint: "Ability to do work" },
        { word: "MICROSCOPE", hint: "Tool to see very small things" }
      ],
      english: [
        { word: "METAPHOR", hint: "Comparison without using like or as" },
        { word: "ADJECTIVE", hint: "Word that describes a noun" },
        { word: "PARAGRAPH", hint: "Group of sentences about one topic" },
        { word: "SYNONYM", hint: "Words with similar meanings" },
        { word: "GRAMMAR", hint: "Rules for using language correctly" },
        { word: "POETRY", hint: "Literature written in verse" },
        { word: "DIALOGUE", hint: "Conversation between characters" },
        { word: "NARRATIVE", hint: "Story or account of events" }
      ],
      history: [
        { word: "CIVILIZATION", hint: "Advanced human society" },
        { word: "DEMOCRACY", hint: "Government by the people" },
        { word: "REVOLUTION", hint: "Sudden change in government" },
        { word: "INDEPENDENCE", hint: "Freedom from outside control" },
        { word: "CONSTITUTION", hint: "Document outlining government rules" },
        { word: "EMPIRE", hint: "Large territory under one ruler" },
        { word: "REPUBLIC", hint: "Government with elected representatives" },
        { word: "MONUMENT", hint: "Structure built to remember someone" }
      ]
    };
    return words[subject.id] || words.math;
  };

  const scrambleWord = (word: string) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
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
    const words = getSubjectWords();
    setCurrentIndex(0);
    setCurrentWord(words[0].word);
    setScrambledWord(scrambleWord(words[0].word));
    setScore(0);
    setCorrectAnswers(0);
    setGameComplete(false);
    setUserInput("");
    setShowHint(false);
    setTimer(0);
  };

  const handleSubmit = () => {
    const words = getSubjectWords();
    const isCorrect = userInput.toUpperCase() === currentWord;
    
    if (isCorrect) {
      const newScore = score + 10;
      const newCorrectAnswers = correctAnswers + 1;
      setScore(newScore);
      setCorrectAnswers(newCorrectAnswers);
      
      if (currentIndex + 1 >= words.length) {
        setGameComplete(true);
        const finalScore = Math.floor((newCorrectAnswers / words.length) * 100);
        const points = finalScore * 2;
        setTimeout(() => onComplete(finalScore, points), 1000);
      } else {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setCurrentWord(words[nextIndex].word);
        setScrambledWord(scrambleWord(words[nextIndex].word));
        setUserInput("");
        setShowHint(false);
      }
    } else {
      // Show correct answer briefly
      setUserInput(currentWord);
      setTimeout(() => {
        if (currentIndex + 1 >= words.length) {
          setGameComplete(true);
          const finalScore = Math.floor((correctAnswers / words.length) * 100);
          const points = finalScore * 2;
          setTimeout(() => onComplete(finalScore, points), 1000);
        } else {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          setCurrentWord(words[nextIndex].word);
          setScrambledWord(scrambleWord(words[nextIndex].word));
          setUserInput("");
          setShowHint(false);
        }
      }, 2000);
    }
  };

  const handleSkip = () => {
    const words = getSubjectWords();
    if (currentIndex + 1 >= words.length) {
      setGameComplete(true);
      const finalScore = Math.floor((correctAnswers / words.length) * 100);
      const points = finalScore * 2;
      setTimeout(() => onComplete(finalScore, points), 1000);
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentWord(words[nextIndex].word);
      setScrambledWord(scrambleWord(words[nextIndex].word));
      setUserInput("");
      setShowHint(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const words = getSubjectWords();
  const currentWordData = words[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant="secondary">{currentIndex + 1}/{words.length}</Badge>
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
            <span>Word Scramble - {subject.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {gameComplete ? (
            <div className="text-center p-6 bg-success/10 rounded-lg border border-success/20">
              <h3 className="text-xl font-bold text-success mb-2">Game Complete! 🎉</h3>
              <p className="text-lg mb-2">Final Score: {score} points</p>
              <p className="text-muted-foreground">
                You got {correctAnswers} out of {words.length} words correct!
              </p>
              <p className="text-muted-foreground">
                Time taken: {formatTime(timer)}
              </p>
            </div>
          ) : (
            <>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-primary tracking-widest">
                  {scrambledWord}
                </h3>
                <p className="text-muted-foreground">
                  Unscramble the letters to form a word related to {subject.name}
                </p>
                
                {showHint && (
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <p className="text-sm text-muted-foreground">
                      <strong>Hint:</strong> {currentWordData?.hint}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Type your answer here..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  className="text-center text-lg"
                />
                
                <div className="flex justify-center space-x-3">
                  <Button onClick={handleSubmit} disabled={!userInput.trim()}>
                    Submit Answer
                  </Button>
                  <Button variant="outline" onClick={() => setShowHint(true)}>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Hint
                  </Button>
                  <Button variant="outline" onClick={handleSkip}>
                    Skip Word
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WordGame;
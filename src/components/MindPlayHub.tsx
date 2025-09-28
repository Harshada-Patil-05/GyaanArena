import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Brain, Gamepad2, Shuffle, Zap, Target } from "lucide-react";
import MemoryMatchGame from "./MemoryMatchGame";
import WordGame from "./WordGame";
import FractionShooterGame from "./FractionShooterGame";

interface MindPlayHubProps {
  subject: any;
  onBack: () => void;
  onComplete: (score: number, points: number) => void;
}

const MindPlayHub = ({ subject, onBack, onComplete }: MindPlayHubProps) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const baseGames = [
    {
      id: "memory-match",
      title: "Memory Match",
      description: "Match related terms and concepts",
      icon: Brain,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      id: "word-scramble",
      title: "Word Scramble",
      description: "Unscramble subject-related words",
      icon: Shuffle,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    }
  ];

  // Add Fraction Shooter for Mathematics
  const mathGames = [
    {
      id: "fraction-shooter",
      title: "Fraction Shooter",
      description: "Shoot balloons with equivalent fractions",
      icon: Target,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    }
  ];

  const games = subject.name.toLowerCase().includes('mathematics') || subject.name.toLowerCase().includes('math')
    ? [...baseGames, ...mathGames]
    : baseGames;

  if (selectedGame === "memory-match") {
    return (
      <MemoryMatchGame
        subject={subject}
        onBack={() => setSelectedGame(null)}
        onComplete={onComplete}
      />
    );
  }

  if (selectedGame === "word-scramble") {
    return (
      <WordGame
        subject={subject}
        onBack={() => setSelectedGame(null)}
        onComplete={onComplete}
      />
    );
  }

  if (selectedGame === "fraction-shooter") {
    return (
      <FractionShooterGame
        subject={subject}
        onBack={() => setSelectedGame(null)}
        onComplete={onComplete}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">MindPlay</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Interactive brain games for {subject.name}
        </p>
        <p className="text-muted-foreground">
          Challenge yourself with fun educational games and earn points!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <Card 
              key={game.id}
              className="card-gradient hover:scale-105 smooth-transition cursor-pointer group"
              onClick={() => setSelectedGame(game.id)}
            >
              <CardHeader className="text-center">
                <div className={`w-20 h-20 ${game.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 smooth-transition`}>
                  <Icon className={`w-10 h-10 ${game.color}`} />
                </div>
                <CardTitle className="text-xl">{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" variant="student">
                  <Zap className="w-4 h-4 mr-2" />
                  Start Game
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-muted/30 rounded-lg border">
        <h3 className="font-semibold text-foreground mb-2">How to Play:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Choose a game from the options above</li>
          <li>• Complete challenges to earn points</li>
          <li>• Higher scores give more points for the leaderboard</li>
          <li>• Games are tailored to your current subject: {subject.name}</li>
        </ul>
      </div>
    </div>
  );
};

export default MindPlayHub;
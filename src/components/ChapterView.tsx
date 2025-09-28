import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Play, CheckCircle } from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
}

interface ChapterViewProps {
  subject: {
    id: string;
    name: string;
    progress: number;
    color: string;
  };
  onBack: () => void;
  onStartQuiz: (subject: string, chapter: string) => void;
}

const ChapterView = ({ subject, onBack, onStartQuiz }: ChapterViewProps) => {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const chapters: Record<string, Chapter[]> = {
    math: [
      { id: "algebra", title: "Algebra Basics", description: "Learn about variables, equations, and expressions", progress: 80, completed: true },
      { id: "geometry", title: "Geometry Fundamentals", description: "Explore shapes, angles, and measurements", progress: 60, completed: false },
      { id: "trigonometry", title: "Introduction to Trigonometry", description: "Sine, cosine, and tangent functions", progress: 40, completed: false },
      { id: "statistics", title: "Data and Statistics", description: "Mean, median, mode, and data representation", progress: 90, completed: true },
      { id: "probability", title: "Probability Theory", description: "Chances, outcomes, and probability calculations", progress: 20, completed: false },
    ],
    science: [
      { id: "physics", title: "Laws of Motion", description: "Newton's laws and forces in physics", progress: 75, completed: true },
      { id: "chemistry", title: "Chemical Reactions", description: "Understanding how substances interact", progress: 55, completed: false },
      { id: "biology", title: "Cell Structure", description: "Basic building blocks of life", progress: 85, completed: true },
      { id: "astronomy", title: "Solar System", description: "Planets, stars, and celestial bodies", progress: 30, completed: false },
      { id: "ecology", title: "Ecosystems", description: "How living things interact with environment", progress: 65, completed: false },
    ],
    english: [
      { id: "grammar", title: "Advanced Grammar", description: "Complex sentence structures and rules", progress: 90, completed: true },
      { id: "literature", title: "Classic Literature", description: "Famous works and their analysis", progress: 70, completed: false },
      { id: "writing", title: "Creative Writing", description: "Essays, stories, and composition", progress: 60, completed: false },
      { id: "poetry", title: "Poetry Analysis", description: "Understanding poems and literary devices", progress: 45, completed: false },
      { id: "speaking", title: "Public Speaking", description: "Presentation skills and confidence", progress: 35, completed: false },
    ],
    history: [
      { id: "ancient", title: "Ancient Civilizations", description: "Early human societies and cultures", progress: 85, completed: true },
      { id: "medieval", title: "Medieval Period", description: "Middle ages and feudal systems", progress: 70, completed: false },
      { id: "independence", title: "Independence Movement", description: "Freedom struggle and national heroes", progress: 90, completed: true },
      { id: "modern", title: "Modern History", description: "20th century events and changes", progress: 50, completed: false },
      { id: "world", title: "World Wars", description: "Global conflicts and their impact", progress: 40, completed: false },
    ],
  };

  const subjectChapters = chapters[subject.id] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Subjects
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{subject.name}</h2>
          <p className="text-muted-foreground">Choose a chapter to continue learning</p>
        </div>
      </div>

      <div className="grid gap-4">
        {subjectChapters.map((chapter) => (
          <Card 
            key={chapter.id} 
            className="card-gradient hover:scale-[1.02] smooth-transition cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${subject.color.replace('text-', 'bg-').replace('500', '100')} flex items-center justify-center`}>
                    {chapter.completed ? (
                      <CheckCircle className={`w-5 h-5 ${subject.color}`} />
                    ) : (
                      <BookOpen className={`w-5 h-5 ${subject.color}`} />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{chapter.title}</CardTitle>
                    <CardDescription>{chapter.description}</CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={chapter.completed ? "default" : "secondary"}>
                    {chapter.progress}% Complete
                  </Badge>
                  {chapter.completed && (
                    <p className="text-xs text-success mt-1">Completed</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={chapter.progress} className="mb-4" />
              <div className="flex space-x-2">
                <Button size="sm" variant="student">
                  <Play className="w-4 h-4 mr-2" />
                  {chapter.completed ? "Review" : "Start Learning"}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onStartQuiz(subject.id, chapter.id)}
                >
                  Take Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChapterView;
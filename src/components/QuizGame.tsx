import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Star, Target, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizGameProps {
  subject: string;
  chapter: string;
  onBack: () => void;
  onComplete: (score: number, points: number) => void;
}

const QuizGame = ({ subject, chapter, onBack, onComplete }: QuizGameProps) => {
  const [gameType, setGameType] = useState<"multiple-choice" | "match-tiles" | "true-false" | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [matchingPairs, setMatchingPairs] = useState<{left: string[], right: string[], matches: number[]}>({
    left: [], right: [], matches: []
  });
  const [selectedMatch, setSelectedMatch] = useState<{type: 'left' | 'right', index: number} | null>(null);

  // Comprehensive questions based on subject/chapter for different class levels
  const questions: Record<string, Record<string, Question[]>> = {
    math: {
      algebra: [
        {
          id: "1",
          question: "What is the value of x in the equation 2x + 5 = 15?",
          options: ["5", "7", "10", "15"],
          correct: 0,
          explanation: "2x + 5 = 15, so 2x = 10, therefore x = 5"
        },
        {
          id: "2",
          question: "Which of these is a linear equation?",
          options: ["x² + 2x = 5", "2x + 3y = 10", "x³ - 4 = 0", "xy = 15"],
          correct: 1,
          explanation: "A linear equation has variables with power 1 only"
        },
        {
          id: "3",
          question: "What is the coefficient of x in 5x + 3y = 12?",
          options: ["3", "5", "12", "8"],
          correct: 1,
          explanation: "The coefficient is the number multiplying the variable"
        },
        {
          id: "4",
          question: "Solve for y: 3y - 7 = 14",
          options: ["7", "21", "5", "3"],
          correct: 0,
          explanation: "3y - 7 = 14, so 3y = 21, therefore y = 7"
        },
        {
          id: "5",
          question: "If 4x + 8 = 24, what is the value of x + 2?",
          options: ["4", "6", "8", "10"],
          correct: 2,
          explanation: "4x + 8 = 24, so 4x = 16, x = 4. Therefore x + 2 = 6"
        },
        {
          id: "6",
          question: "What is the slope of the line y = 3x + 5?",
          options: ["3", "5", "8", "-3"],
          correct: 0,
          explanation: "In the form y = mx + b, m is the slope. So slope = 3"
        }
      ],
      geometry: [
        {
          id: "1",
          question: "What is the sum of interior angles of a triangle?",
          options: ["90°", "180°", "270°", "360°"],
          correct: 1,
          explanation: "The sum of interior angles of any triangle is always 180°"
        },
        {
          id: "2",
          question: "What is the area of a rectangle with length 8 cm and width 5 cm?",
          options: ["13 cm²", "26 cm²", "40 cm²", "80 cm²"],
          correct: 2,
          explanation: "Area of rectangle = length × width = 8 × 5 = 40 cm²"
        },
        {
          id: "3",
          question: "In a right triangle, which side is the longest?",
          options: ["Base", "Height", "Hypotenuse", "All are equal"],
          correct: 2,
          explanation: "The hypotenuse is always the longest side in a right triangle"
        },
        {
          id: "4",
          question: "What is the perimeter of a square with side 6 cm?",
          options: ["12 cm", "18 cm", "24 cm", "36 cm"],
          correct: 2,
          explanation: "Perimeter of square = 4 × side = 4 × 6 = 24 cm"
        },
        {
          id: "5",
          question: "How many sides does a hexagon have?",
          options: ["5", "6", "7", "8"],
          correct: 1,
          explanation: "A hexagon has 6 sides by definition"
        },
        {
          id: "6",
          question: "What is the circumference of a circle with radius 7 cm? (Use π = 22/7)",
          options: ["22 cm", "44 cm", "154 cm", "308 cm"],
          correct: 1,
          explanation: "Circumference = 2πr = 2 × (22/7) × 7 = 44 cm"
        }
      ]
    },
    science: {
      physics: [
        {
          id: "1",
          question: "What is Newton's First Law of Motion?",
          options: ["F = ma", "Every action has equal reaction", "Object at rest stays at rest", "Energy is conserved"],
          correct: 2,
          explanation: "Newton's First Law states that an object at rest stays at rest unless acted upon by a force"
        },
        {
          id: "2",
          question: "What is the unit of force?",
          options: ["Joule", "Newton", "Watt", "Pascal"],
          correct: 1,
          explanation: "Force is measured in Newtons (N)"
        },
        {
          id: "3",
          question: "What is the acceleration due to gravity on Earth?",
          options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "11 m/s²"],
          correct: 0,
          explanation: "The acceleration due to gravity on Earth is approximately 9.8 m/s²"
        },
        {
          id: "4",
          question: "Which of Newton's laws states F = ma?",
          options: ["First Law", "Second Law", "Third Law", "Fourth Law"],
          correct: 1,
          explanation: "Newton's Second Law states that Force equals mass times acceleration (F = ma)"
        },
        {
          id: "5",
          question: "What happens to the kinetic energy when speed doubles?",
          options: ["Doubles", "Triples", "Quadruples", "Remains same"],
          correct: 2,
          explanation: "Kinetic energy = ½mv². When speed doubles, KE becomes 4 times"
        },
        {
          id: "6",
          question: "What is the SI unit of power?",
          options: ["Joule", "Newton", "Watt", "Pascal"],
          correct: 2,
          explanation: "Power is measured in Watts (W) in the SI system"
        }
      ],
      chemistry: [
        {
          id: "1",
          question: "What is the chemical symbol for Gold?",
          options: ["Go", "Gd", "Au", "Ag"],
          correct: 2,
          explanation: "Gold's chemical symbol is Au, from the Latin word 'aurum'"
        },
        {
          id: "2",
          question: "How many electrons does a neutral Carbon atom have?",
          options: ["4", "6", "8", "12"],
          correct: 1,
          explanation: "Carbon has atomic number 6, so it has 6 electrons in a neutral atom"
        },
        {
          id: "3",
          question: "What is the pH of pure water at 25°C?",
          options: ["6", "7", "8", "9"],
          correct: 1,
          explanation: "Pure water has a pH of 7, which is neutral"
        },
        {
          id: "4",
          question: "Which gas is most abundant in Earth's atmosphere?",
          options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"],
          correct: 2,
          explanation: "Nitrogen makes up about 78% of Earth's atmosphere"
        },
        {
          id: "5",
          question: "What is the molecular formula of methane?",
          options: ["CH₄", "CO₂", "H₂O", "NH₃"],
          correct: 0,
          explanation: "Methane consists of one carbon atom and four hydrogen atoms (CH₄)"
        },
        {
          id: "6",
          question: "What type of bond holds NaCl together?",
          options: ["Covalent", "Ionic", "Metallic", "Hydrogen"],
          correct: 1,
          explanation: "NaCl (sodium chloride) is held together by ionic bonds"
        }
      ],
      biology: [
        {
          id: "1",
          question: "What is the basic unit of life?",
          options: ["Tissue", "Organ", "Cell", "Organism"],
          correct: 2,
          explanation: "The cell is the basic structural and functional unit of all living things"
        },
        {
          id: "2",
          question: "Which organelle is known as the 'powerhouse of the cell'?",
          options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
          correct: 1,
          explanation: "Mitochondria produce ATP energy for the cell, earning the nickname 'powerhouse'"
        },
        {
          id: "3",
          question: "What process do plants use to make their own food?",
          options: ["Respiration", "Photosynthesis", "Digestion", "Reproduction"],
          correct: 1,
          explanation: "Plants use photosynthesis to convert sunlight, CO₂, and water into glucose"
        },
        {
          id: "4",
          question: "How many chambers does a human heart have?",
          options: ["2", "3", "4", "5"],
          correct: 2,
          explanation: "The human heart has 4 chambers: 2 atria and 2 ventricles"
        },
        {
          id: "5",
          question: "What is the function of red blood cells?",
          options: ["Fight infection", "Carry oxygen", "Form clots", "Digest food"],
          correct: 1,
          explanation: "Red blood cells contain hemoglobin which carries oxygen throughout the body"
        },
        {
          id: "6",
          question: "Which part of the brain controls balance and coordination?",
          options: ["Cerebrum", "Cerebellum", "Medulla", "Pons"],
          correct: 1,
          explanation: "The cerebellum is responsible for balance, coordination, and fine motor control"
        }
      ]
    },
    english: {
      grammar: [
        {
          id: "1",
          question: "What is the plural form of 'child'?",
          options: ["childs", "childes", "children", "child's"],
          correct: 2,
          explanation: "'Children' is the irregular plural form of 'child'"
        },
        {
          id: "2",
          question: "Which sentence uses correct punctuation?",
          options: ["Its a beautiful day.", "It's a beautiful day.", "Its' a beautiful day.", "It,s a beautiful day."],
          correct: 1,
          explanation: "'It's' is the contraction for 'it is', requiring an apostrophe"
        },
        {
          id: "3",
          question: "What type of word is 'quickly' in: 'She ran quickly'?",
          options: ["Noun", "Verb", "Adjective", "Adverb"],
          correct: 3,
          explanation: "'Quickly' describes how she ran, making it an adverb"
        },
        {
          id: "4",
          question: "Which is the correct past tense of 'go'?",
          options: ["goed", "went", "gone", "going"],
          correct: 1,
          explanation: "'Went' is the irregular past tense form of 'go'"
        },
        {
          id: "5",
          question: "What is the subject in: 'The big dog barked loudly'?",
          options: ["big", "dog", "The big dog", "barked"],
          correct: 2,
          explanation: "The complete subject includes the article and adjective: 'The big dog'"
        },
        {
          id: "6",
          question: "Which sentence is in passive voice?",
          options: ["John ate the apple.", "The apple was eaten by John.", "John is eating an apple.", "John will eat the apple."],
          correct: 1,
          explanation: "Passive voice uses 'was/were + past participle' and focuses on the action receiver"
        }
      ],
      literature: [
        {
          id: "1",
          question: "What is a metaphor?",
          options: ["A direct comparison using 'like' or 'as'", "A direct comparison without 'like' or 'as'", "An exaggeration", "A sound word"],
          correct: 1,
          explanation: "A metaphor is a direct comparison that doesn't use 'like' or 'as'"
        },
        {
          id: "2",
          question: "What is the main character in a story called?",
          options: ["Antagonist", "Protagonist", "Supporting character", "Narrator"],
          correct: 1,
          explanation: "The protagonist is the main character around whom the story revolves"
        },
        {
          id: "3",
          question: "What is alliteration?",
          options: ["Repetition of vowel sounds", "Repetition of consonant sounds", "Rhyming words", "Repeated lines"],
          correct: 1,
          explanation: "Alliteration is the repetition of initial consonant sounds in consecutive words"
        },
        {
          id: "4",
          question: "What is the setting of a story?",
          options: ["The main character", "The plot", "When and where it takes place", "The theme"],
          correct: 2,
          explanation: "Setting refers to the time and place where the story occurs"
        },
        {
          id: "5",
          question: "What is a haiku?",
          options: ["A 14-line poem", "A 3-line poem with 5-7-5 syllables", "A rhyming couplet", "A story poem"],
          correct: 1,
          explanation: "A haiku is a traditional Japanese poem with 3 lines following a 5-7-5 syllable pattern"
        },
        {
          id: "6",
          question: "What is personification?",
          options: ["Comparing two things", "Giving human traits to non-human things", "Exaggerating for effect", "Using the five senses"],
          correct: 1,
          explanation: "Personification gives human characteristics to non-human objects or ideas"
        }
      ]
    },
    history: {
      "ancient-civilizations": [
        {
          id: "1",
          question: "Which river was crucial to Ancient Egyptian civilization?",
          options: ["Ganges", "Nile", "Euphrates", "Indus"],
          correct: 1,
          explanation: "The Nile River was the lifeline of Ancient Egyptian civilization"
        },
        {
          id: "2",
          question: "What were the Egyptian kings called?",
          options: ["Emperors", "Sultans", "Pharaohs", "Caesars"],
          correct: 2,
          explanation: "Ancient Egyptian rulers were called Pharaohs"
        },
        {
          id: "3",
          question: "Which ancient wonder was located in Egypt?",
          options: ["Hanging Gardens", "Colossus of Rhodes", "Great Pyramid of Giza", "Lighthouse of Alexandria"],
          correct: 2,
          explanation: "The Great Pyramid of Giza is the only surviving ancient wonder"
        },
        {
          id: "4",
          question: "What writing system did ancient Egyptians use?",
          options: ["Cuneiform", "Hieroglyphics", "Sanskrit", "Latin"],
          correct: 1,
          explanation: "Ancient Egyptians used hieroglyphics, a system of picture writing"
        },
        {
          id: "5",
          question: "Which civilization is known for the first democracy?",
          options: ["Roman", "Egyptian", "Greek", "Persian"],
          correct: 2,
          explanation: "Ancient Athens in Greece is credited with developing the first democracy"
        },
        {
          id: "6",
          question: "What was the primary building material for Mesopotamian ziggurats?",
          options: ["Stone", "Wood", "Mud bricks", "Metal"],
          correct: 2,
          explanation: "Mesopotamian ziggurats were built primarily with sun-dried mud bricks"
        }
      ],
      "medieval-period": [
        {
          id: "1",
          question: "What was the feudal system?",
          options: ["A trading system", "A social hierarchy system", "A religious system", "A military system"],
          correct: 1,
          explanation: "Feudalism was a social hierarchy system based on land ownership and loyalty"
        },
        {
          id: "2",
          question: "Who were the Vikings?",
          options: ["Medieval farmers", "Seafaring warriors from Scandinavia", "Christian monks", "Castle builders"],
          correct: 1,
          explanation: "Vikings were seafaring warriors and traders from Scandinavia (8th-11th centuries)"
        },
        {
          id: "3",
          question: "What was the Black Death?",
          options: ["A war", "A plague", "A famine", "A drought"],
          correct: 1,
          explanation: "The Black Death was a devastating plague that killed about 1/3 of Europe's population"
        },
        {
          id: "4",
          question: "What were the Crusades?",
          options: ["Trade expeditions", "Religious wars", "Exploration voyages", "Scientific missions"],
          correct: 1,
          explanation: "The Crusades were religious wars fought between Christians and Muslims"
        },
        {
          id: "5",
          question: "What was a knight's code of conduct called?",
          options: ["Feudalism", "Chivalry", "Monasticism", "Scholasticism"],
          correct: 1,
          explanation: "Chivalry was the code of conduct that knights were expected to follow"
        },
        {
          id: "6",
          question: "Which empire was ruled by Charlemagne?",
          options: ["Byzantine Empire", "Holy Roman Empire", "Ottoman Empire", "Mongol Empire"],
          correct: 1,
          explanation: "Charlemagne ruled the Holy Roman Empire and was crowned emperor in 800 AD"
        }
      ]
    }
  };

  const getQuestions = () => {
    return questions[subject]?.[chapter] || [
      {
        id: "default",
        question: "This is a sample question for " + subject + " - " + chapter,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0,
        explanation: "This is a sample explanation"
      }
    ];
  };

  const currentQuestions = getQuestions();

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === currentQuestions[currentQuestion].correct;
    if (isCorrect) {
      const earnedPoints = 10;
      setScore(score + 1);
      setPoints(points + earnedPoints);
      toast.success(`Correct! +${earnedPoints} points`, {
        icon: "🎉"
      });
    } else {
      toast.error("Wrong answer! Try again next time", {
        icon: "❌"
      });
    }

    setTimeout(() => {
      if (currentQuestion < currentQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameCompleted(true);
        onComplete(score + (isCorrect ? 1 : 0), points + (isCorrect ? 10 : 0));
      }
    }, 2000);
  };

  const initializeMatchingGame = () => {
    // Create subject-specific matching pairs
    let pairs: [string, string][] = [];
    
    if (subject === "math") {
      pairs = [
        ["2x + 4 = 10", "x = 3"],
        ["5 × 6", "30"],
        ["√64", "8"],
        ["15 ÷ 3", "5"],
        ["Area of square (side=4)", "16"],
      ];
    } else if (subject === "science") {
      pairs = [
        ["H₂O", "Water"],
        ["Newton's 2nd Law", "F = ma"],
        ["Symbol for Gold", "Au"],
        ["Heart chambers", "4"],
        ["Speed of light", "3×10⁸ m/s"],
      ];
    } else if (subject === "english") {
      pairs = [
        ["Plural of child", "children"],
        ["Past tense of go", "went"],
        ["It is (contraction)", "it's"],
        ["Metaphor definition", "Direct comparison"],
        ["Haiku syllable pattern", "5-7-5"],
      ];
    } else if (subject === "history") {
      pairs = [
        ["Egyptian rulers", "Pharaohs"],
        ["Nile River location", "Egypt"],
        ["First democracy", "Greece"],
        ["Medieval code", "Chivalry"],
        ["Black Death was", "Plague"],
      ];
    } else {
      // Default pairs
      pairs = [
        ["2 + 2", "4"],
        ["5 × 3", "15"],
        ["10 ÷ 2", "5"],
        ["7 - 3", "4"],
        ["3²", "9"],
      ];
    }
    
    const shuffledLeft = pairs.map(p => p[0]).sort(() => Math.random() - 0.5);
    const shuffledRight = pairs.map(p => p[1]).sort(() => Math.random() - 0.5);
    
    setMatchingPairs({
      left: shuffledLeft,
      right: shuffledRight,
      matches: new Array(pairs.length).fill(-1)
    });
  };

  const handleMatchSelect = (type: 'left' | 'right', index: number) => {
    if (selectedMatch) {
      if (selectedMatch.type !== type) {
        // Check if this is a correct match
        const leftValue = type === 'left' ? matchingPairs.left[index] : matchingPairs.left[selectedMatch.index];
        const rightValue = type === 'right' ? matchingPairs.right[index] : matchingPairs.right[selectedMatch.index];
        
        // Enhanced matching logic for different subjects
        const correctPairs = [
          // Math pairs
          ["2x + 4 = 10", "x = 3"], ["5 × 6", "30"], ["√64", "8"], ["15 ÷ 3", "5"], ["Area of square (side=4)", "16"],
          // Science pairs  
          ["H₂O", "Water"], ["Newton's 2nd Law", "F = ma"], ["Symbol for Gold", "Au"], ["Heart chambers", "4"], ["Speed of light", "3×10⁸ m/s"],
          // English pairs
          ["Plural of child", "children"], ["Past tense of go", "went"], ["It is (contraction)", "it's"], ["Metaphor definition", "Direct comparison"], ["Haiku syllable pattern", "5-7-5"],
          // History pairs
          ["Egyptian rulers", "Pharaohs"], ["Nile River location", "Egypt"], ["First democracy", "Greece"], ["Medieval code", "Chivalry"], ["Black Death was", "Plague"],
          // Default pairs
          ["2 + 2", "4"], ["5 × 3", "15"], ["10 ÷ 2", "5"], ["7 - 3", "4"], ["3²", "9"]
        ];
        
        const isMatch = correctPairs.some(pair => 
          (pair[0] === leftValue && pair[1] === rightValue) ||
          (pair[1] === leftValue && pair[0] === rightValue)
        );
        
        if (isMatch) {
          toast.success("Correct match! +5 points");
          setPoints(points + 5);
          setScore(score + 1);
        } else {
          toast.error("Wrong match! Try again");
        }
        
        setSelectedMatch(null);
      } else {
        setSelectedMatch({ type, index });
      }
    } else {
      setSelectedMatch({ type, index });
    }
  };

  if (!gameType) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chapters
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Choose Quiz Game</h2>
            <p className="text-muted-foreground">Select a game type for {subject} - {chapter}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-gradient hover:scale-105 smooth-transition cursor-pointer" onClick={() => setGameType("multiple-choice")}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle>Multiple Choice</CardTitle>
              <CardDescription>Answer questions with multiple options</CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-gradient hover:scale-105 smooth-transition cursor-pointer" onClick={() => { setGameType("match-tiles"); initializeMatchingGame(); }}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <CardTitle>Match the Tiles</CardTitle>
              <CardDescription>Match questions with correct answers</CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-gradient hover:scale-105 smooth-transition cursor-pointer" onClick={() => setGameType("true-false")}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle>True or False</CardTitle>
              <CardDescription>Decide if statements are true or false</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    const percentage = Math.round((score / currentQuestions.length) * 100);
    return (
      <div className="space-y-6">
        <Card className="card-gradient text-center">
          <CardHeader>
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            <CardDescription>Great job on completing the {gameType} game</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{score}</p>
                <p className="text-sm text-muted-foreground">Correct Answers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-500">{points}</p>
                <p className="text-sm text-muted-foreground">Points Earned</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{percentage}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
            </div>
            <div className="flex space-x-4 justify-center">
              <Button onClick={onBack}>Back to Chapters</Button>
              <Button variant="outline" onClick={() => {
                setGameType(null);
                setCurrentQuestion(0);
                setScore(0);
                setPoints(0);
                setGameCompleted(false);
              }}>
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameType === "multiple-choice") {
    const question = currentQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / currentQuestions.length) * 100;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              Question {currentQuestion + 1} of {currentQuestions.length}
            </Badge>
            <Badge variant="default">
              <Star className="w-4 h-4 mr-1" />
              {points} points
            </Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="text-xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  showResult
                    ? index === question.correct
                      ? "default"
                      : index === selectedAnswer
                      ? "destructive"
                      : "outline"
                    : selectedAnswer === index
                    ? "secondary"
                    : "outline"
                }
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                    {showResult && index === question.correct && <CheckCircle className="w-4 h-4" />}
                    {showResult && index === selectedAnswer && index !== question.correct && <X className="w-4 h-4" />}
                  </div>
                  <span>{option}</span>
                </div>
              </Button>
            ))}
            
            {showResult && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">{question.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameType === "match-tiles") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Badge variant="default">
            <Star className="w-4 h-4 mr-1" />
            {points} points
          </Badge>
        </div>

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Match the Tiles</CardTitle>
            <CardDescription>Click on items from both columns to match them</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="font-semibold mb-4">Questions</h3>
                {matchingPairs.left.map((item, index) => (
                  <Button
                    key={index}
                    variant={selectedMatch?.type === 'left' && selectedMatch.index === index ? "secondary" : "outline"}
                    className="w-full"
                    onClick={() => handleMatchSelect('left', index)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold mb-4">Answers</h3>
                {matchingPairs.right.map((item, index) => (
                  <Button
                    key={index}
                    variant={selectedMatch?.type === 'right' && selectedMatch.index === index ? "secondary" : "outline"}
                    className="w-full"
                    onClick={() => handleMatchSelect('right', index)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameType === "true-false") {
    // Generate true/false questions based on subject
    const trueFalseQuestions = [
      // Math true/false questions
      { question: "The sum of angles in a triangle is always 180°", answer: true, subject: "math" },
      { question: "A square has 5 sides", answer: false, subject: "math" },
      { question: "The hypotenuse is the longest side in a right triangle", answer: true, subject: "math" },
      
      // Science true/false questions  
      { question: "Water boils at 100°C at sea level", answer: true, subject: "science" },
      { question: "The heart has 3 chambers", answer: false, subject: "science" },
      { question: "Gold's chemical symbol is Au", answer: true, subject: "science" },
      
      // English true/false questions
      { question: "The plural of 'child' is 'childs'", answer: false, subject: "english" },
      { question: "A metaphor uses 'like' or 'as' for comparison", answer: false, subject: "english" },
      { question: "A haiku has 3 lines", answer: true, subject: "english" },
      
      // History true/false questions
      { question: "Ancient Egyptian rulers were called Pharaohs", answer: true, subject: "history" },
      { question: "The Vikings were from South America", answer: false, subject: "history" },
      { question: "The Nile River was important to Egyptian civilization", answer: true, subject: "history" }
    ];

    const subjectQuestions = trueFalseQuestions.filter(q => 
      q.subject === subject.toLowerCase()
    ).slice(0, 5);

    const currentTFQuestion = subjectQuestions[currentQuestion] || trueFalseQuestions[0];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              Question {currentQuestion + 1} of {subjectQuestions.length}
            </Badge>
            <Badge variant="default">
              <Star className="w-4 h-4 mr-1" />
              {points} points
            </Badge>
          </div>
        </div>

        <Progress value={((currentQuestion + 1) / subjectQuestions.length) * 100} className="h-2" />

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="text-xl">True or False?</CardTitle>
            <CardDescription>Read the statement and decide if it's true or false</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <p className="text-lg font-medium">{currentTFQuestion.question}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={
                  showResult
                    ? currentTFQuestion.answer === true
                      ? "default"
                      : selectedAnswer === 1
                      ? "destructive"
                      : "outline"
                    : selectedAnswer === 1
                    ? "secondary"
                    : "outline"
                }
                className="h-20 text-lg"
                onClick={() => !showResult && handleTrueFalseAnswer(true)}
                disabled={showResult}
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6" />
                  <span>TRUE</span>
                </div>
              </Button>
              
              <Button
                variant={
                  showResult
                    ? currentTFQuestion.answer === false
                      ? "default"
                      : selectedAnswer === 0
                      ? "destructive"
                      : "outline"
                    : selectedAnswer === 0
                    ? "secondary"
                    : "outline"
                }
                className="h-20 text-lg"
                onClick={() => !showResult && handleTrueFalseAnswer(false)}
                disabled={showResult}
              >
                <div className="flex items-center space-x-3">
                  <X className="w-6 h-6" />
                  <span>FALSE</span>
                </div>
              </Button>
            </div>
            
            {showResult && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  The correct answer is: <strong>{currentTFQuestion.answer ? "TRUE" : "FALSE"}</strong>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleTrueFalseAnswer = (answer: boolean) => {
    const trueFalseQuestions = [
      { question: "The sum of angles in a triangle is always 180°", answer: true, subject: "math" },
      { question: "A square has 5 sides", answer: false, subject: "math" },
      { question: "The hypotenuse is the longest side in a right triangle", answer: true, subject: "math" },
      { question: "Water boils at 100°C at sea level", answer: true, subject: "science" },
      { question: "The heart has 3 chambers", answer: false, subject: "science" },
      { question: "Gold's chemical symbol is Au", answer: true, subject: "science" },
      { question: "The plural of 'child' is 'childs'", answer: false, subject: "english" },
      { question: "A metaphor uses 'like' or 'as' for comparison", answer: false, subject: "english" },
      { question: "A haiku has 3 lines", answer: true, subject: "english" },
      { question: "Ancient Egyptian rulers were called Pharaohs", answer: true, subject: "history" },
      { question: "The Vikings were from South America", answer: false, subject: "history" },
      { question: "The Nile River was important to Egyptian civilization", answer: true, subject: "history" }
    ];

    const subjectQuestions = trueFalseQuestions.filter(q => 
      q.subject === subject.toLowerCase()
    ).slice(0, 5);

    const currentTFQuestion = subjectQuestions[currentQuestion] || trueFalseQuestions[0];
    
    setSelectedAnswer(answer ? 1 : 0);
    setShowResult(true);
    
    const isCorrect = answer === currentTFQuestion.answer;
    if (isCorrect) {
      const earnedPoints = 8;
      setScore(score + 1);
      setPoints(points + earnedPoints);
      toast.success(`Correct! +${earnedPoints} points`, {
        icon: "🎉"
      });
    } else {
      toast.error("Wrong answer! Try again next time", {
        icon: "❌"
      });
    }

    setTimeout(() => {
      if (currentQuestion < subjectQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameCompleted(true);
        onComplete(score + (isCorrect ? 1 : 0), points + (isCorrect ? 8 : 0));
      }
    }, 2000);
  };
};

export default QuizGame;
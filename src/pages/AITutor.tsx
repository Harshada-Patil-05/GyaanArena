import React, { useState, useRef } from 'react';
import { Send, MessageCircle, Mic, MicOff, BookOpen, HelpCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'normal' | 'quiz';
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Quiz {
  questions: QuizQuestion[];
  currentQuestion: number;
  answers: number[];
  score: number;
}

const subjects = ['Math', 'Science', 'History', 'English'];

const AITutor = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('Math');
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [showSteps, setShowSteps] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Initialize speech recognition
  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not process your voice. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callGeminiAPI = async (prompt: string, subject: string, isQuizRequest: boolean = false) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
    }

    const systemPrompt = isQuizRequest 
      ? `You are an expert ${subject} tutor. Create exactly 5 multiple-choice questions about the topic mentioned. Return ONLY a JSON object with this structure:
{
  "questions": [
    {
      "question": "Question text here",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}`
      : `You are an expert ${subject} tutor. ${showSteps ? 'Always break down your answers into clear, numbered steps.' : 'Provide clear, concise answers.'} Be encouraging and educational. Focus on helping students understand concepts thoroughly.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nStudent question: ${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini API');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      type: 'normal'
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      if (isQuizMode) {
        // Generate quiz questions
        const quizPrompt = `Generate a quiz about: ${userMessage}`;
        const response = await callGeminiAPI(quizPrompt, selectedSubject, true);
        
        try {
          // Try to parse JSON response
          const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
          const quizData = JSON.parse(cleanResponse);
          
          if (quizData.questions && Array.isArray(quizData.questions)) {
            const newQuiz: Quiz = {
              questions: quizData.questions,
              currentQuestion: 0,
              answers: [],
              score: 0
            };
            setQuiz(newQuiz);
            
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: `Great! I've created a ${selectedSubject} quiz about "${userMessage}". Let's start with question 1 of ${quizData.questions.length}:`,
              timestamp: new Date(),
              type: 'quiz'
            };
            setMessages(prev => [...prev, aiMessage]);
          } else {
            throw new Error('Invalid quiz format');
          }
        } catch (parseError) {
          // Fallback to normal response if JSON parsing fails
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "I'll help explain this topic instead of creating a quiz. " + response,
            timestamp: new Date(),
            type: 'normal'
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      } else {
        // Normal Q&A mode
        const response = await callGeminiAPI(userMessage, selectedSubject);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          type: 'normal'
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting to the AI service. Please check that your VITE_GEMINI_API_KEY is properly configured and try again.",
        timestamp: new Date(),
        type: 'normal'
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to get AI response. Please check your API key configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const answerQuizQuestion = (selectedOption: number) => {
    if (!quiz) return;

    const currentQ = quiz.questions[quiz.currentQuestion];
    const isCorrect = selectedOption === currentQ.correct;
    
    const newAnswers = [...quiz.answers, selectedOption];
    const newScore = quiz.score + (isCorrect ? 1 : 0);
    
    // Show answer feedback
    const feedbackMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `${isCorrect ? '✅ Correct!' : '❌ Incorrect.'} ${currentQ.explanation}`,
      timestamp: new Date(),
      type: 'quiz'
    };
    setMessages(prev => [...prev, feedbackMessage]);

    if (quiz.currentQuestion < quiz.questions.length - 1) {
      // Next question
      setQuiz({
        ...quiz,
        currentQuestion: quiz.currentQuestion + 1,
        answers: newAnswers,
        score: newScore
      });
      
      const nextMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Question ${quiz.currentQuestion + 2} of ${quiz.questions.length}:`,
        timestamp: new Date(),
        type: 'quiz'
      };
      setMessages(prev => [...prev, nextMessage]);
    } else {
      // Quiz complete
      const finalScore = Math.round((newScore / quiz.questions.length) * 100);
      const completeMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `🎉 Quiz Complete!\n\nYour Score: ${newScore}/${quiz.questions.length} (${finalScore}%)\n\n${finalScore >= 80 ? 'Excellent work!' : finalScore >= 60 ? 'Good job! Keep practicing.' : 'Keep studying and you\'ll improve!'}`,
        timestamp: new Date(),
        type: 'quiz'
      };
      setMessages(prev => [...prev, completeMessage]);
      setQuiz(null);
      setIsQuizMode(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentQuizQuestion = quiz?.questions[quiz.currentQuestion];

  return (
    <Layout>
      <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <div className="p-4 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Tutor
                </h1>
                <p className="text-sm text-muted-foreground">Your intelligent study companion</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant={isQuizMode ? "default" : "outline"}
                onClick={() => setIsQuizMode(!isQuizMode)}
                className="flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Quiz Mode
              </Button>
              
              <Button
                variant={showSteps ? "default" : "outline"}
                onClick={() => setShowSteps(!showSteps)}
                size="sm"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant={isQuizMode ? "default" : "secondary"}>
              Mode: {isQuizMode ? "Quiz Generation" : "Q&A"}
            </Badge>
            <Badge variant="outline">Subject: {selectedSubject}</Badge>
            <Badge variant="outline">
              Steps: {showSteps ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Welcome to AI Tutor!</h2>
              <p className="text-muted-foreground mb-6">
                I'm here to help you learn {selectedSubject}. You can:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Ask Questions</h3>
                  <p className="text-sm text-muted-foreground">Get detailed explanations with step-by-step solutions</p>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Generate Quizzes</h3>
                  <p className="text-sm text-muted-foreground">Test your knowledge with custom multiple-choice questions</p>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Voice Input</h3>
                  <p className="text-sm text-muted-foreground">Use the microphone button to ask questions by voice</p>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Subject Focus</h3>
                  <p className="text-sm text-muted-foreground">Switch between Math, Science, History, and English</p>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="shrink-0">
                      <AvatarFallback className={message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}>
                        {message.role === 'user' ? 'U' : 'AI'}
                      </AvatarFallback>
                    </Avatar>
                    <Card className={`${message.role === 'user' 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white dark:bg-slate-800 shadow-lg'
                    }`}>
                      <CardContent className="p-4">
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
              
              {/* Quiz Question Display */}
              {quiz && currentQuizQuestion && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 max-w-[85%]">
                    <Avatar>
                      <AvatarFallback className="bg-purple-500 text-white">AI</AvatarFallback>
                    </Avatar>
                    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3">{currentQuizQuestion.question}</h3>
                        <div className="space-y-2">
                          {currentQuizQuestion.options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="w-full justify-start text-left h-auto p-3"
                              onClick={() => answerQuizQuestion(index)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                        <Badge variant="outline" className="mt-3">
                          Question {(quiz.currentQuestion || 0) + 1} of {quiz.questions.length}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 max-w-[85%]">
                    <Avatar>
                      <AvatarFallback className="bg-purple-500 text-white">AI</AvatarFallback>
                    </Avatar>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">AI is thinking...</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input area */}
        <div className="p-4 border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="flex space-x-3 max-w-4xl mx-auto">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isQuizMode ? "Enter a topic to generate quiz questions..." : `Ask me anything about ${selectedSubject}...`}
              disabled={isLoading}
              className="flex-1 h-12"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleVoiceInput}
              disabled={isLoading}
              className={`h-12 w-12 ${isRecording ? 'bg-red-500 text-white' : ''}`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            <Button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              className="h-12 px-6"
            >
              <Send className="w-4 h-4 mr-2" />
              {isQuizMode ? 'Generate Quiz' : 'Ask'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2 max-w-4xl mx-auto">
            {isQuizMode 
              ? "Quiz mode: Enter a topic and I'll create 5 multiple-choice questions for you!"
              : "Press the microphone to use voice input, or type your question below."
            }
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AITutor;
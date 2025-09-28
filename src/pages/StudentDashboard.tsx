import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import ChapterView from "@/components/ChapterView";
import QuizGame from "@/components/QuizGame";
import MindPlayHub from "@/components/MindPlayHub";
import logoImage from "/image.png";
import {
  BookOpen,
  Trophy,
  Target,
  Clock,
  Star,
  PlayCircle,
  FileText,
  Brain,
  Users,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";

const StudentDashboard = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState<{subject: string, chapter: string} | null>(null);
  const [showMindPlay, setShowMindPlay] = useState<any>(null);
  const [totalPoints, setTotalPoints] = useState(2450);
  const [subjectPoints, setSubjectPoints] = useState({
    math: 850,
    science: 620,
    english: 780,
    history: 200,
  });

  const classes = [
    { id: "6th", name: "Class 6th", students: 42, color: "bg-red-500" },
    { id: "7th", name: "Class 7th", students: 38, color: "bg-orange-500" },
    { id: "8th", name: "Class 8th", students: 45, color: "bg-yellow-500" },
    { id: "9th", name: "Class 9th", students: 41, color: "bg-green-500" },
    { id: "10th", name: "Class 10th", students: 39, color: "bg-blue-500" },
  ];

  const subjects = [
    { id: "math", name: "Mathematics", icon: Target, progress: 78, color: "text-blue-500" },
    { id: "science", name: "Science", icon: Brain, progress: 65, color: "text-green-500" },
    { id: "english", name: "English", icon: BookOpen, progress: 82, color: "text-purple-500" },
    { id: "history", name: "History", icon: Clock, progress: 71, color: "text-orange-500" },
  ];

  const recentActivities = [
    { type: "assignment", title: "Algebra Quiz", subject: "Mathematics", status: "completed", score: 95 },
    { type: "lesson", title: "Chemical Reactions", subject: "Science", status: "in-progress", progress: 60 },
    { type: "test", title: "English Essay", subject: "English", status: "pending", dueDate: "Tomorrow" },
  ];

  const achievements = [
    { title: "Quiz Master", description: "Scored 90+ in 5 consecutive quizzes", icon: Trophy, color: "text-yellow-500" },
    { title: "Study Streak", description: "7 days continuous learning", icon: Star, color: "text-blue-500" },
    { title: "Team Player", description: "Participated in group study", icon: Users, color: "text-green-500" },
  ];

  const stats = [
    { label: "Total Points", value: totalPoints.toLocaleString(), icon: Star, color: "text-yellow-500" },
    { label: "Courses Completed", value: "12", icon: BookOpen, color: "text-blue-500" },
    { label: "Current Streak", value: "7 days", icon: TrendingUp, color: "text-green-500" },
    { label: "Rank", value: "#3", icon: Trophy, color: "text-purple-500" },
  ];

  const handleQuizComplete = (score: number, points: number) => {
    setTotalPoints(prev => prev + points);
    
    // Update subject-specific points based on current quiz
    if (showQuiz) {
      const subjectId = subjects.find(s => s.name.toLowerCase().includes(showQuiz.subject.toLowerCase()))?.id;
      if (subjectId) {
        setSubjectPoints(prev => ({
          ...prev,
          [subjectId]: prev[subjectId as keyof typeof prev] + points
        }));
      }
    }
    
    setShowQuiz(null);
    setSelectedSubject(null);
    setShowMindPlay(null);
  };

  const handleStartQuiz = (subject: string, chapter: string) => {
    setShowQuiz({ subject, chapter });
  };

  const handleContinueLearning = (subject: any) => {
    setSelectedSubject(subject);
  };

  const handleMindPlay = (subject: any) => {
    setShowMindPlay(subject);
  };

  if (showMindPlay) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <MindPlayHub
            subject={showMindPlay}
            onBack={() => setShowMindPlay(null)}
            onComplete={handleQuizComplete}
          />
        </div>
      </Layout>
    );
  }

  if (showQuiz) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <QuizGame
            subject={showQuiz.subject}
            chapter={showQuiz.chapter}
            onBack={() => setShowQuiz(null)}
            onComplete={handleQuizComplete}
          />
        </div>
      </Layout>
    );
  }

  if (selectedSubject) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <ChapterView
            subject={selectedSubject}
            onBack={() => setSelectedSubject(null)}
            onStartQuiz={handleStartQuiz}
          />
        </div>
      </Layout>
    );
  }

  if (!selectedClass) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Choose Your Class</h1>
            <p className="text-muted-foreground">Select your class to access subjects and learning materials</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <Card 
                key={classItem.id} 
                className="card-gradient hover:scale-105 smooth-transition cursor-pointer group"
                onClick={() => setSelectedClass(classItem.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${classItem.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 smooth-transition`}>
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{classItem.name}</CardTitle>
                  <CardDescription>{classItem.students} students enrolled</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="student">
                    Enter Class
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-white/95 shadow-lg border-2 border-white/50 flex items-center justify-center hover:scale-105 smooth-transition backdrop-blur-sm">
            <img
              src={logoImage}
              alt="Gyaan Arena Logo"
              className="w-12 h-12 object-contain drop-shadow-sm"
            />
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, Student!<br />
              <span className="text-primary">Gyaan Arena</span> 👋
            </h1>
            <p className="text-muted-foreground">Continue your learning journey in {classes.find(c => c.id === selectedClass)?.name}</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedClass(null)}>
            Change Class
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-gradient">
                <CardContent className="p-4 flex items-center space-x-3">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Subjects */}
          <div className="lg:col-span-2">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>My Subjects</span>
                </CardTitle>
                <CardDescription>Click on any subject to start learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjects.map((subject) => {
                  const Icon = subject.icon;
                  return (
                    <div 
                      key={subject.id}
                      className="p-4 rounded-lg border border-border hover:bg-accent/50 smooth-transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-6 h-6 ${subject.color}`} />
                          <h3 className="font-semibold text-foreground">{subject.name}</h3>
                        </div>
                        <Badge variant="secondary">{subject.progress}% Complete</Badge>
                      </div>
                      <Progress value={subject.progress} className="mb-3" />
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="student"
                          onClick={() => handleContinueLearning(subject)}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Continue Learning
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Assignments
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleContinueLearning(subject)}
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Take Quiz
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMindPlay(subject)}
                        >
                          <Brain className="w-4 h-4 mr-2" />
                          MindPlay
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Recent Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <Badge 
                        variant={activity.status === 'completed' ? 'default' : activity.status === 'in-progress' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.subject}</p>
                    {activity.score && (
                      <p className="text-xs text-success font-medium">Score: {activity.score}%</p>
                    )}
                    {activity.progress && (
                      <Progress value={activity.progress} className="mt-2 h-1" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                      <Icon className={`w-5 h-5 ${achievement.color} mt-0.5`} />
                      <div>
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;

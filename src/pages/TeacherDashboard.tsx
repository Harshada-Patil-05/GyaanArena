import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  Upload,
  FileText,
  Users,
  BarChart3,
  Bell,
  Download,
  Plus,
  Eye,
  Edit,
  Calendar,
  BookOpen,
  Trophy,
  Brain,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";

const TeacherDashboard = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const classes = [
    { id: "6th", name: "Class 6th", students: 42, subjects: 5 },
    { id: "7th", name: "Class 7th", students: 38, subjects: 5 },
    { id: "8th", name: "Class 8th", students: 45, subjects: 6 },
    { id: "9th", name: "Class 9th", students: 41, subjects: 6 },
    { id: "10th", name: "Class 10th", students: 45, subjects: 6 },
  ];

  const recentAssignments = [
    { title: "Math Quiz", class: "Class 6th", submitted: 40, total: 42, dueDate: "2024-01-15" },
    { title: "English Essay", class: "Class 7th", submitted: 35, total: 38, dueDate: "2024-01-16" },
    { title: "Science Project", class: "Class 8th", submitted: 42, total: 45, dueDate: "2024-01-17" },
    { title: "History Test", class: "Class 9th", submitted: 38, total: 41, dueDate: "2024-01-18" },
    { title: "Algebra Test", class: "Class 10th", submitted: 42, total: 45, dueDate: "2024-01-19" },
  ];

  const classProgress = [
    { subject: "Mathematics", class: "6th", avgScore: 72, completion: 88 },
    { subject: "English", class: "7th", avgScore: 75, completion: 82 },
    { subject: "Science", class: "8th", avgScore: 79, completion: 90 },
    { subject: "History", class: "9th", avgScore: 77, completion: 85 },
    { subject: "Mathematics", class: "10th", avgScore: 78, completion: 85 },
  ];

  const stats = [
    { label: "Total Students", value: "211", icon: Users, color: "text-blue-500" },
    { label: "Active Assignments", value: "12", icon: FileText, color: "text-green-500" },
    { label: "Avg Class Score", value: "76%", icon: Trophy, color: "text-yellow-500" },
    { label: "Pending Reviews", value: "18", icon: Clock, color: "text-orange-500" },
  ];

  const notifications = [
    { type: "assignment", message: "New submission for Algebra Test", time: "5 min ago" },
    { type: "question", message: "Student asked question in Science class", time: "15 min ago" },
    { type: "reminder", message: "Grade History essays due tomorrow", time: "1 hour ago" },
  ];

  // Analytics data
  const studentAnalytics = [
    { name: "Amit Kumar", class: "6th", avgScore: 85, improvement: "+5%", status: "excellent", totalAssignments: 12, completed: 11 },
    { name: "Priya Sharma", class: "7th", avgScore: 78, improvement: "+2%", status: "good", totalAssignments: 10, completed: 9 },
    { name: "Rahul Singh", class: "8th", avgScore: 92, improvement: "+8%", status: "excellent", totalAssignments: 14, completed: 14 },
    { name: "Sneha Patel", class: "9th", avgScore: 68, improvement: "-3%", status: "needs-help", totalAssignments: 11, completed: 8 },
    { name: "Arjun Gupta", class: "10th", avgScore: 81, improvement: "+4%", status: "good", totalAssignments: 13, completed: 12 },
  ];

  const classAnalytics = [
    { 
      class: "6th", 
      totalStudents: 42, 
      avgScore: 72, 
      trend: "up", 
      improvement: "+3%",
      subjects: [
        { name: "Math", avgScore: 75, completion: 88 },
        { name: "English", avgScore: 68, completion: 92 },
        { name: "Science", avgScore: 74, completion: 85 },
        { name: "Social Studies", avgScore: 71, completion: 90 },
        { name: "Hindi", avgScore: 69, completion: 87 }
      ]
    },
    { 
      class: "7th", 
      totalStudents: 38, 
      avgScore: 75, 
      trend: "up", 
      improvement: "+2%",
      subjects: [
        { name: "Math", avgScore: 78, completion: 82 },
        { name: "English", avgScore: 72, completion: 89 },
        { name: "Science", avgScore: 76, completion: 85 },
        { name: "Social Studies", avgScore: 74, completion: 88 },
        { name: "Hindi", avgScore: 75, completion: 84 }
      ]
    },
    { 
      class: "8th", 
      totalStudents: 45, 
      avgScore: 79, 
      trend: "up", 
      improvement: "+5%",
      subjects: [
        { name: "Math", avgScore: 82, completion: 90 },
        { name: "English", avgScore: 76, completion: 87 },
        { name: "Science", avgScore: 81, completion: 92 },
        { name: "Social Studies", avgScore: 78, completion: 89 },
        { name: "Hindi", avgScore: 77, completion: 86 },
        { name: "Computer Science", avgScore: 85, completion: 94 }
      ]
    },
    { 
      class: "9th", 
      totalStudents: 41, 
      avgScore: 77, 
      trend: "down", 
      improvement: "-1%",
      subjects: [
        { name: "Math", avgScore: 80, completion: 85 },
        { name: "English", avgScore: 74, completion: 88 },
        { name: "Science", avgScore: 79, completion: 87 },
        { name: "Social Studies", avgScore: 75, completion: 82 },
        { name: "Hindi", avgScore: 76, completion: 89 },
        { name: "Computer Science", avgScore: 81, completion: 91 }
      ]
    },
    { 
      class: "10th", 
      totalStudents: 45, 
      avgScore: 78, 
      trend: "up", 
      improvement: "+1%",
      subjects: [
        { name: "Math", avgScore: 81, completion: 85 },
        { name: "English", avgScore: 75, completion: 89 },
        { name: "Science", avgScore: 80, completion: 87 },
        { name: "Social Studies", avgScore: 76, completion: 84 },
        { name: "Hindi", avgScore: 77, completion: 86 },
        { name: "Computer Science", avgScore: 83, completion: 92 }
      ]
    }
  ];

  if (showAnalytics) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          {/* Analytics Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                📊 Class & Student Analytics
              </h1>
              <p className="text-muted-foreground">Comprehensive performance insights for all classes</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowAnalytics(false)}
            >
              ← Back to Dashboard
            </Button>
          </div>

          <Tabs defaultValue="classes" className="space-y-6">
            <TabsList>
              <TabsTrigger value="classes">Class Analytics</TabsTrigger>
              <TabsTrigger value="students">Student Analytics</TabsTrigger>
              <TabsTrigger value="performance">Performance Trends</TabsTrigger>
            </TabsList>

            {/* Class Analytics Tab */}
            <TabsContent value="classes" className="space-y-6">
              <div className="grid gap-6">
                {classAnalytics.map((classData, index) => (
                  <Card key={index} className="card-gradient">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5" />
                            <span>Class {classData.class}</span>
                          </CardTitle>
                          <CardDescription>
                            {classData.totalStudents} students • Average: {classData.avgScore}%
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={classData.trend === "up" ? "default" : "secondary"}
                            className="flex items-center space-x-1"
                          >
                            {classData.trend === "up" ? 
                              <TrendingUp className="w-3 h-3" /> : 
                              <TrendingDown className="w-3 h-3" />
                            }
                            <span>{classData.improvement}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classData.subjects.map((subject, subIndex) => (
                          <div key={subIndex} className="p-4 rounded-lg bg-muted/30">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{subject.name}</h4>
                              <Badge variant="secondary">{subject.avgScore}%</Badge>
                            </div>
                            <Progress value={subject.completion} className="h-2 mb-2" />
                            <p className="text-xs text-muted-foreground">
                              {subject.completion}% completion
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Student Analytics Tab */}
            <TabsContent value="students" className="space-y-6">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Top Performing Students</span>
                  </CardTitle>
                  <CardDescription>Individual student performance across all classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentAnalytics.map((student, index) => (
                      <div key={index} className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">Class {student.class}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={
                                student.status === "excellent" ? "default" :
                                student.status === "good" ? "secondary" : "destructive"
                              }
                            >
                              {student.avgScore}% avg
                            </Badge>
                            <Badge 
                              variant={student.improvement.startsWith("+") ? "default" : "secondary"}
                              className="flex items-center space-x-1"
                            >
                              {student.improvement.startsWith("+") ? 
                                <TrendingUp className="w-3 h-3" /> : 
                                <TrendingDown className="w-3 h-3" />
                              }
                              <span>{student.improvement}</span>
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Assignments: {student.completed}/{student.totalAssignments} completed
                          </span>
                          <Progress 
                            value={(student.completed / student.totalAssignments) * 100} 
                            className="w-24 h-2" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Trends Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="w-5 h-5" />
                      <span>Class Performance Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {classAnalytics.map((classData, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div>
                            <span className="font-medium">Class {classData.class}</span>
                            <p className="text-sm text-muted-foreground">{classData.totalStudents} students</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{classData.avgScore}%</span>
                            <Badge 
                              variant={classData.trend === "up" ? "default" : "secondary"}
                              className="flex items-center space-x-1"
                            >
                              {classData.trend === "up" ? 
                                <TrendingUp className="w-3 h-3" /> : 
                                <TrendingDown className="w-3 h-3" />
                              }
                              <span>{classData.improvement}</span>
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5" />
                      <span>Performance Categories</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <h4 className="font-medium text-green-700 dark:text-green-300">Excellent (85%+)</h4>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {studentAnalytics.filter(s => s.status === "excellent").length} students
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <h4 className="font-medium text-blue-700 dark:text-blue-300">Good (70-84%)</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {studentAnalytics.filter(s => s.status === "good").length} students
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                        <h4 className="font-medium text-orange-700 dark:text-orange-300">Needs Help (&lt;70%)</h4>
                        <p className="text-sm text-orange-600 dark:text-orange-400">
                          {studentAnalytics.filter(s => s.status === "needs-help").length} students
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Teacher Dashboard 👩‍🏫
            </h1>
            <p className="text-muted-foreground">Manage your classes, assignments, and track student progress</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="teacher">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              New Assignment
            </Button>
          </div>
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
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Classes Overview */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>My Classes</span>
                </CardTitle>
                <CardDescription>Manage your classes and students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {classes.map((classItem) => (
                  <div 
                    key={classItem.id}
                    className="p-4 rounded-lg border border-border hover:bg-accent/50 smooth-transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{classItem.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {classItem.students} students • {classItem.subjects} subjects
                        </p>
                      </div>
                      <Badge variant="secondary">{classItem.students} students</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="student">
                        <Eye className="w-4 h-4 mr-2" />
                        View Class
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowAnalytics(true)}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Assignments */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Recent Assignments</span>
                </CardTitle>
                <CardDescription>Track assignment submissions and progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAssignments.map((assignment, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">{assignment.class}</p>
                      </div>
                      <Badge 
                        variant={assignment.submitted === assignment.total ? "default" : "secondary"}
                      >
                        {assignment.submitted}/{assignment.total} submitted
                      </Badge>
                    </div>
                    <Progress 
                      value={(assignment.submitted / assignment.total) * 100} 
                      className="mb-3" 
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="student">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Assignment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Quiz Generator
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowAnalytics(true)}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Class Analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Class
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Reports
                </Button>
              </CardContent>
            </Card>

            {/* Class Progress */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Class Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {classProgress.map((progress, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{progress.subject}</h4>
                        <p className="text-xs text-muted-foreground">Class {progress.class}</p>
                      </div>
                      <Badge variant="secondary">{progress.avgScore}% avg</Badge>
                    </div>
                    <Progress value={progress.completion} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {progress.completion}% completion rate
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Recent Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/30">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
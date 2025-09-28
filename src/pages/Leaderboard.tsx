import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Trophy,
  TrendingUp,
  Medal,
  Star,
  Users,
  Target,
} from "lucide-react";

const Leaderboard = () => {
  // Mock data - in a real app, this would come from props, context, or API
  const [totalPoints] = useState(2450);
  const [subjectPoints] = useState({
    math: 850,
    science: 620,
    english: 780,
    history: 200,
  });

  const subjects = [
    { id: "math", name: "Mathematics", chartColor: "#3b82f6" },
    { id: "science", name: "Science", chartColor: "#10b981" },
    { id: "english", name: "English", chartColor: "#8b5cf6" },
    { id: "history", name: "History", chartColor: "#f59e0b" },
  ];

  // Prepare chart data for pie chart
  const chartData = subjects.map(subject => ({
    name: subject.name,
    value: subjectPoints[subject.id as keyof typeof subjectPoints],
    fill: subject.chartColor,
  }));

  // Generate leaderboard data with rankings
  const leaderboardData = [
    { name: "You", points: totalPoints, rank: 3, avatar: "🎓", trend: "up" },
    { name: "Alex Chen", points: 2890, rank: 1, avatar: "👨‍🎓", trend: "same" },
    { name: "Sarah Johnson", points: 2650, rank: 2, avatar: "👩‍🎓", trend: "up" },
    { name: "Mike Davis", points: 2340, rank: 4, avatar: "👨‍🎓", trend: "down" },
    { name: "Emma Wilson", points: 2180, rank: 5, avatar: "👩‍🎓", trend: "up" },
    { name: "John Smith", points: 2050, rank: 6, avatar: "👨‍🎓", trend: "up" },
    { name: "Lisa Brown", points: 1980, rank: 7, avatar: "👩‍🎓", trend: "same" },
    { name: "David Wilson", points: 1890, rank: 8, avatar: "👨‍🎓", trend: "down" },
    { name: "Anna Lee", points: 1750, rank: 9, avatar: "👩‍🎓", trend: "up" },
    { name: "Tom Garcia", points: 1620, rank: 10, avatar: "👨‍🎓", trend: "down" },
  ].sort((a, b) => b.points - a.points);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span>Class Leaderboard</span>
          </h1>
          <p className="text-muted-foreground">Track your progress and compete with classmates</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="card-gradient">
            <CardContent className="p-4 flex items-center space-x-3">
              <Medal className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">3rd</p>
                <p className="text-sm text-muted-foreground">Your Rank</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-4 flex items-center space-x-3">
              <Star className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{totalPoints.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-4 flex items-center space-x-3">
              <Users className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{leaderboardData.length}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-4 flex items-center space-x-3">
              <Target className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">450</p>
                <p className="text-sm text-muted-foreground">Points Behind #1</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Leaderboard Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Leaderboard Rankings */}
          <div className="lg:col-span-2">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Medal className="w-5 h-5 text-yellow-500" />
                  <span>Class Rankings</span>
                </CardTitle>
                <CardDescription>Current standings based on total points earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboardData.map((student, index) => (
                    <div 
                      key={student.name}
                      className={`flex items-center space-x-3 p-4 rounded-lg smooth-transition hover:scale-[1.02] ${
                        student.name === "You" ? "bg-primary/10 border border-primary/20 shadow-lg" : "bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? "bg-yellow-500 text-white" :
                          index === 1 ? "bg-gray-400 text-white" :
                          index === 2 ? "bg-amber-600 text-white" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-2xl">{student.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className={`font-semibold text-lg ${student.name === "You" ? "text-primary" : "text-foreground"}`}>
                              {student.name}
                            </span>
                            {student.name === "You" && (
                              <Badge variant="default" className="ml-2 text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className="text-sm font-medium">
                              {student.points.toLocaleString()} pts
                            </Badge>
                            <div className={`text-sm font-medium ${
                              student.trend === "up" ? "text-green-500" :
                              student.trend === "down" ? "text-red-500" :
                              "text-muted-foreground"
                            }`}>
                              {student.trend === "up" ? "↗️" : student.trend === "down" ? "↘️" : "→"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subject Progress Pie Chart */}
          <div>
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span>Your Points by Subject</span>
                </CardTitle>
                <CardDescription>Distribution of your earned points across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 mb-4">
                  <ChartContainer
                    config={{
                      mathematics: { label: "Mathematics", color: "#3b82f6" },
                      science: { label: "Science", color: "#10b981" },
                      english: { label: "English", color: "#8b5cf6" },
                      history: { label: "History", color: "#f59e0b" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="space-y-2">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: subject.chartColor }}
                        />
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {subjectPoints[subject.id as keyof typeof subjectPoints]} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card className="card-gradient mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-500/10">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <div>
                      <h4 className="font-medium text-sm">Top 3 Rank</h4>
                      <p className="text-xs text-muted-foreground">Achieved 3rd place in class</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-500/10">
                    <Star className="w-5 h-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-sm">Math Champion</h4>
                      <p className="text-xs text-muted-foreground">Highest points in Mathematics</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-500/10">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="font-medium text-sm">Rising Star</h4>
                      <p className="text-xs text-muted-foreground">Moved up 2 ranks this week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart3, Calendar, Clock, Dumbbell, Heart, Trophy, User } from "lucide-react";

export default function ActivityPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Activity</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Daily Steps</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,246</div>
            <p className="text-xs text-muted-foreground">+20% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Minutes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">15 minutes to goal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">486</div>
            <p className="text-xs text-muted-foreground">Daily goal: 500</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72</div>
            <p className="text-xs text-muted-foreground">BPM (Resting)</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Activity chart will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {recentWorkouts.map((workout, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b last:border-0">
                    <div className="flex items-center space-x-4">
                      <Dumbbell className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">{workout.duration} • {workout.calories} cal</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{workout.date}</div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {achievements.map((achievement, i) => (
                  <div key={i} className="flex items-center space-x-4 py-4 border-b last:border-0">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const recentWorkouts = [
  {
    name: "Upper Body Strength",
    duration: "45 min",
    calories: "320",
    date: "Today"
  },
  {
    name: "Morning Run",
    duration: "30 min",
    calories: "280",
    date: "Yesterday"
  },
  {
    name: "HIIT Session",
    duration: "25 min",
    calories: "250",
    date: "2 days ago"
  },
  {
    name: "Yoga Flow",
    duration: "40 min",
    calories: "180",
    date: "3 days ago"
  },
  {
    name: "Lower Body Focus",
    duration: "50 min",
    calories: "350",
    date: "4 days ago"
  }
];

const achievements = [
  {
    title: "Early Bird",
    description: "Complete 5 workouts before 8 AM"
  },
  {
    title: "Consistency King",
    description: "Work out for 7 days in a row"
  },
  {
    title: "Calorie Crusher",
    description: "Burn 5000 calories in a week"
  },
  {
    title: "Step Master",
    description: "Reach 10,000 steps for 5 consecutive days"
  },
  {
    title: "Strength Champion",
    description: "Complete 10 strength training sessions"
  }
];

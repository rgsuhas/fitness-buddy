"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  workoutPlan: WorkoutDay[];
}

const AIGeneratorPage: React.FC = () => {
  const [goals, setGoals] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [equipment, setEquipment] = useState<string>('');
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setWorkoutPlan(null);

    try {
      const response = await fetch('/api/workout-plans/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goals, experienceLevel, equipment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate workout plan');
      }

      const data: WorkoutPlan = await response.json();
      setWorkoutPlan(data);
      toast.success('Workout plan generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
      console.error('Error generating workout plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="h-full p-4 lg:p-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">AI Workout Generator</h1>
        <p className="text-muted-foreground">Generate a personalized workout plan using AI based on your goals, experience, and available equipment.</p>

        <Card>
          <CardHeader>
            <CardTitle>Generate Your Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="goals">Your Fitness Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="e.g., Build muscle, lose weight, improve endurance, general fitness"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel} required>
                  <SelectTrigger id="experienceLevel">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="equipment">Available Equipment</Label>
                <Textarea
                  id="equipment"
                  placeholder="e.g., Dumbbells, resistance bands, pull-up bar, gym access, bodyweight only"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Workout Plan'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {workoutPlan && workoutPlan.workoutPlan && workoutPlan.workoutPlan.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Workout Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {workoutPlan.workoutPlan.map((dayData, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">{dayData.day} - {dayData.focus}</h3>
                  <ul className="space-y-2">
                    {dayData.exercises.map((exercise, exIndex) => (
                      <li key={exIndex} className="text-sm">
                        <strong>{exercise.name}:</strong> {exercise.sets} sets of {exercise.reps} reps (Rest: {exercise.rest}s)
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
};

export default AIGeneratorPage;
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, Calculator } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface MealEntry {
  id: string
  date: Date
  meal: string
  calories: number
  protein: number
  carbs: number
  fats: number
  type: "breakfast" | "lunch" | "dinner" | "snack"
}

interface UserProfile {
  age: number;
  gender: "male" | "female";
  weight: number;
  height: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very-active";
  goal: "lose" | "maintain" | "gain";
  bodyType: "ectomorph" | "mesomorph" | "endomorph";
}

const mealTypes = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
]

export default function NutritionPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isAddingMeal, setIsAddingMeal] = useState(false)
  const [isEditingMeal, setIsEditingMeal] = useState(false)
  const [currentMeal, setCurrentMeal] = useState<MealEntry | null>(null)
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [activeTab, setActiveTab] = useState<string>("meals")
  

  // Calorie calculator state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: 30,
    gender: "male",
    weight: 70, // kg
    height: 175, // cm
    activityLevel: "moderate",
    goal: "maintain",
    bodyType: "mesomorph"
  })
  
  const [calorieResults, setCalorieResults] = useState({
    bmr: 0,
    tdee: 0,
    targetCalories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  })

  const [newMeal, setNewMeal] = useState<Omit<MealEntry, "id" | "date">>({
    meal: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    type: "breakfast",
  })

  const handleAddMeal = () => {
    if (!newMeal.meal || !newMeal.calories || !newMeal.type) {
      toast.error("Error logging meal", {
        description: "Please fill in all fields.",
      })
      return
    }

    const meal: MealEntry = {
      id: Math.random().toString(36).substring(7),
      date: selectedDate,
      meal: newMeal.meal,
      calories: Number(newMeal.calories),
      protein: Number(newMeal.protein),
      carbs: Number(newMeal.carbs),
      fats: Number(newMeal.fats),
      type: newMeal.type as "breakfast" | "lunch" | "dinner" | "snack",
    }

    setMeals([...meals, meal])
    setNewMeal({
      meal: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      type: "breakfast",
    })
    setIsAddingMeal(false)
    toast({
      title: "Success",
      description: "Meal added successfully",
    })
  }

  const handleEditMeal = () => {
    if (!currentMeal) return

    setMeals(meals.map((meal) => (meal.id === currentMeal.id ? currentMeal : meal)))
    setCurrentMeal(null)
    toast({
      title: "Success",
      description: "Meal updated successfully",
    })
  }

  const handleDeleteMeal = (id: string) => {
    setMeals(meals.filter((meal) => meal.id !== id))
    toast({
      title: "Success",
      description: "Meal deleted successfully",
    })
  }

  const getMealsByDate = (date: Date) => {
    if (!date) return []
    return meals.filter(
      (meal) => format(meal.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    )
  }

  const getDailyTotals = (date: Date) => {
    const dailyMeals = getMealsByDate(date)
    return {
      calories: dailyMeals.reduce((sum, meal) => sum + meal.calories, 0),
      protein: dailyMeals.reduce((sum, meal) => sum + meal.protein, 0),
      carbs: dailyMeals.reduce((sum, meal) => sum + meal.carbs, 0),
      fats: dailyMeals.reduce((sum, meal) => sum + meal.fats, 0),
    }
  }

  // Calorie calculator functions
  const calculateBMR = () => {
    // Mifflin-St Jeor Equation
    if (userProfile.gender === "male") {
      return 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
    } else {
      return 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161;
    }
  };

  const calculateTDEE = (bmr: number) => {
    const activityMultipliers = {
      sedentary: 1.2, // Little or no exercise
      light: 1.375, // Light exercise 1-3 days/week
      moderate: 1.55, // Moderate exercise 3-5 days/week
      active: 1.725, // Hard exercise 6-7 days/week
      "very-active": 1.9, // Very hard exercise & physical job
    };
    return bmr * activityMultipliers[userProfile.activityLevel];
  };

  const calculateTargetCalories = (tdee: number) => {
    const goalMultipliers = {
      lose: 0.8, // 20% deficit
      maintain: 1,
      gain: 1.15, // 15% surplus
    };
    
    // Adjust based on body type
    const bodyTypeAdjustments = {
      ectomorph: userProfile.goal === "gain" ? 1.05 : 1, // Ectomorphs need more calories to gain
      mesomorph: 1, // No adjustment for mesomorphs
      endomorph: userProfile.goal === "lose" ? 0.95 : 1, // Endomorphs need fewer calories to lose
    };
    
    return tdee * goalMultipliers[userProfile.goal] * bodyTypeAdjustments[userProfile.bodyType];
  };

  const calculateMacros = (targetCalories: number) => {
    let proteinRatio, carbsRatio, fatsRatio;
    
    // Adjust macros based on goal and body type
    if (userProfile.goal === "lose") {
      proteinRatio = 0.4; // Higher protein for muscle preservation
      fatsRatio = 0.35;
      carbsRatio = 0.25;
    } else if (userProfile.goal === "gain") {
      proteinRatio = 0.3;
      carbsRatio = 0.5; // Higher carbs for energy
      fatsRatio = 0.2;
    } else { // maintain
      proteinRatio = 0.3;
      carbsRatio = 0.4;
      fatsRatio = 0.3;
    }
    
    // Adjust based on body type
    if (userProfile.bodyType === "ectomorph") {
      // Ectomorphs do better with more carbs
      carbsRatio += 0.05;
      fatsRatio -= 0.05;
    } else if (userProfile.bodyType === "endomorph") {
      // Endomorphs do better with fewer carbs
      carbsRatio -= 0.05;
      fatsRatio += 0.05;
    }
    
    const protein = (targetCalories * proteinRatio) / 4; // 4 calories per gram of protein
    const carbs = (targetCalories * carbsRatio) / 4; // 4 calories per gram of carbs
    const fats = (targetCalories * fatsRatio) / 9; // 9 calories per gram of fat
    
    return { protein, carbs, fats };
  };

  const calculateNutrition = () => {
    const bmr = calculateBMR();
    const tdee = calculateTDEE(bmr);
    const targetCalories = calculateTargetCalories(tdee);
    const macros = calculateMacros(targetCalories);
    
    setCalorieResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      protein: Math.round(macros.protein),
      carbs: Math.round(macros.carbs),
      fats: Math.round(macros.fats)
    });
    
          toast.success("Meal logged", {
        description: "Your meal has been successfully logged.",
      });
  };

  const getMealsForDate = (date: Date) => {
    if (!date) return []
    return meals.filter(
      (meal) => format(meal.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    )
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
              className="rounded-md border shadow"
            />
            <div className="mt-4">
              <Dialog open={isAddingMeal} onOpenChange={setIsAddingMeal}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Meal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Meal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label>Meal Name</label>
                      <Input
                        value={newMeal.meal}
                        onChange={(e) =>
                          setNewMeal({ ...newMeal, meal: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Type</label>
                      <Select
                        value={newMeal.type}
                        onValueChange={(value) =>
                          setNewMeal({ ...newMeal, type: value as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                        <SelectContent>
                          {mealTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label>Calories</label>
                        <Input
                          type="number"
                          value={newMeal.calories}
                          onChange={(e) =>
                            setNewMeal({
                              ...newMeal,
                              calories: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Protein (g)</label>
                        <Input
                          type="number"
                          value={newMeal.protein}
                          onChange={(e) =>
                            setNewMeal({
                              ...newMeal,
                              protein: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Carbs (g)</label>
                        <Input
                          type="number"
                          value={newMeal.carbs}
                          onChange={(e) =>
                            setNewMeal({
                              ...newMeal,
                              carbs: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label>Fats (g)</label>
                        <Input
                          type="number"
                          value={newMeal.fats}
                          onChange={(e) =>
                            setNewMeal({
                              ...newMeal,
                              fats: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddMeal} className="w-full">
                      Add Meal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="meals">Meal Tracker</TabsTrigger>
              <TabsTrigger value="calculator">Calorie Calculator</TabsTrigger>
            </TabsList>
            
            <TabsContent value="meals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Meals for {format(selectedDate, "MMMM d, yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getMealsForDate(selectedDate).length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No meals logged for this date
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getMealsForDate(selectedDate).map((meal) => (
                        <div
                          key={meal.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{meal.meal}</div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {meal.type}
                            </div>
                          </div>
                          <div className="text-right">
                            <div>{meal.calories} calories</div>
                            <div className="text-sm text-muted-foreground">
                              P: {meal.protein}g | C: {meal.carbs}g | F:{" "}
                              {meal.fats}g
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Dialog
                              open={isEditingMeal && currentMeal?.id === meal.id}
                              onOpenChange={() =>
                                isEditingMeal
                                  ? setIsEditingMeal(false)
                                  : setCurrentMeal(meal)
                              }
                            >
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Meal</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <label>Meal Name</label>
                                    <Input
                                      value={currentMeal?.meal}
                                      onChange={(e) =>
                                        setCurrentMeal({
                                          ...currentMeal!,
                                          meal: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label>Type</label>
                                    <Select
                                      value={currentMeal?.type}
                                      onValueChange={(value) =>
                                        setCurrentMeal({
                                          ...currentMeal!,
                                          type: value as any,
                                        })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select meal type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {mealTypes.map((type) => (
                                          <SelectItem
                                            key={type.value}
                                            value={type.value}
                                          >
                                            {type.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label>Calories</label>
                                      <Input
                                        type="number"
                                        value={currentMeal?.calories}
                                        onChange={(e) =>
                                          setCurrentMeal({
                                            ...currentMeal!,
                                            calories: Number(e.target.value),
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label>Protein (g)</label>
                                      <Input
                                        type="number"
                                        value={currentMeal?.protein}
                                        onChange={(e) =>
                                          setCurrentMeal({
                                            ...currentMeal!,
                                            protein: Number(e.target.value),
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label>Carbs (g)</label>
                                      <Input
                                        type="number"
                                        value={currentMeal?.carbs}
                                        onChange={(e) =>
                                          setCurrentMeal({
                                            ...currentMeal!,
                                            carbs: Number(e.target.value),
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label>Fats (g)</label>
                                      <Input
                                        type="number"
                                        value={currentMeal?.fats}
                                        onChange={(e) =>
                                          setCurrentMeal({
                                            ...currentMeal!,
                                            fats: Number(e.target.value),
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <Button
                                    onClick={handleEditMeal}
                                    className="w-full"
                                  >
                                    Update Meal
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMeal(meal.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Total Calories
                      </div>
                      <div className="text-2xl font-bold">
                        {getMealsForDate(selectedDate).reduce(
                          (acc, meal) => acc + meal.calories,
                          0
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Protein
                      </div>
                      <div className="text-2xl font-bold">
                        {getMealsForDate(selectedDate).reduce(
                          (acc, meal) => acc + meal.protein,
                          0
                        )}
                        g
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Carbs</div>
                      <div className="text-2xl font-bold">
                        {getMealsForDate(selectedDate).reduce(
                          (acc, meal) => acc + meal.carbs,
                          0
                        )}
                        g
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Fats</div>
                      <div className="text-2xl font-bold">
                        {getMealsForDate(selectedDate).reduce(
                          (acc, meal) => acc + meal.fats,
                          0
                        )}
                        g
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calculator" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="mr-2 h-5 w-5" />
                    Calorie & Macro Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Age</Label>
                          <Input 
                            type="number" 
                            value={userProfile.age}
                            onChange={(e) => setUserProfile({
                              ...userProfile,
                              age: Number(e.target.value)
                            })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <RadioGroup 
                            value={userProfile.gender}
                            onValueChange={(value) => setUserProfile({
                              ...userProfile,
                              gender: value as "male" | "female"
                            })}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male">Male</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female">Female</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Weight (kg)</Label>
                          <Input 
                            type="number" 
                            value={userProfile.weight}
                            onChange={(e) => setUserProfile({
                              ...userProfile,
                              weight: Number(e.target.value)
                            })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Height (cm)</Label>
                          <Input 
                            type="number" 
                            value={userProfile.height}
                            onChange={(e) => setUserProfile({
                              ...userProfile,
                              height: Number(e.target.value)
                            })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Activity Level</Label>
                          <Select
                            value={userProfile.activityLevel}
                            onValueChange={(value) => setUserProfile({
                              ...userProfile,
                              activityLevel: value as any
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                              <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                              <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                              <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                              <SelectItem value="very-active">Very Active (hard exercise daily)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Goal</Label>
                          <Select
                            value={userProfile.goal}
                            onValueChange={(value) => setUserProfile({
                              ...userProfile,
                              goal: value as any
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lose">Lose Weight</SelectItem>
                              <SelectItem value="maintain">Maintain Weight</SelectItem>
                              <SelectItem value="gain">Gain Weight/Muscle</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Body Type</Label>
                          <Select
                            value={userProfile.bodyType}
                            onValueChange={(value) => setUserProfile({
                              ...userProfile,
                              bodyType: value as any
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ectomorph">Ectomorph (Slim, struggles to gain weight)</SelectItem>
                              <SelectItem value="mesomorph">Mesomorph (Athletic, gains/loses easily)</SelectItem>
                              <SelectItem value="endomorph">Endomorph (Stocky, gains weight easily)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button className="w-full mt-6" onClick={calculateNutrition}>
                          Calculate
                        </Button>
                      </div>
                    </div>
                    
                    {calorieResults.targetCalories > 0 && (
                      <Card className="mt-6">
                        <CardHeader>
                          <CardTitle>Your Personalized Nutrition Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">Basal Metabolic Rate</div>
                              <div className="text-2xl font-bold">{calorieResults.bmr} calories</div>
                              <div className="text-xs text-muted-foreground">Calories burned at rest</div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">Total Daily Energy</div>
                              <div className="text-2xl font-bold">{calorieResults.tdee} calories</div>
                              <div className="text-xs text-muted-foreground">Calories burned with activity</div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">Target Daily Calories</div>
                              <div className="text-2xl font-bold">{calorieResults.targetCalories} calories</div>
                              <div className="text-xs text-muted-foreground">Based on your goals</div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">Protein</div>
                              <div className="text-2xl font-bold">{calorieResults.protein}g</div>
                              <div className="text-xs text-muted-foreground">{Math.round(calorieResults.protein * 4)} calories</div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">Carbs</div>
                              <div className="text-2xl font-bold">{calorieResults.carbs}g</div>
                              <div className="text-xs text-muted-foreground">{Math.round(calorieResults.carbs * 4)} calories</div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">Fats</div>
                              <div className="text-2xl font-bold">{calorieResults.fats}g</div>
                              <div className="text-xs text-muted-foreground">{Math.round(calorieResults.fats * 9)} calories</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

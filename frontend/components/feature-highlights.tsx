import { DumbbellIcon as DumbellIcon, LineChart, Users, Sparkles } from "lucide-react"
import Image from "next/image"

export function FeatureHighlights() {
  const features = [
    {
      name: "Personalized Workouts",
      description: "Get AI-generated workout plans tailored to your fitness goals, experience level, and preferences.",
      icon: DumbellIcon,
      image: "/images/workout-1.jpg",
    },
    {
      name: "Progress Tracking",
      description:
        "Track your fitness journey with detailed charts and analytics to visualize your improvements over time.",
      icon: LineChart,
      image: "/images/workout-2.jpg",
    },
    {
      name: "Community Support",
      description: "Connect with fitness buddies who share similar goals and motivate each other to achieve more.",
      icon: Users,
      image: "/images/workout-3.jpg",
    },
    {
      name: "Challenges & Rewards",
      description: "Participate in fitness challenges, compete with friends, and earn rewards for reaching milestones.",
      icon: Sparkles,
      image: "/images/workout-4.jpg",
    },
  ]

  return (
    <div className="py-16 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-12">
          <h2 className="text-base font-semibold leading-7 text-primary">Achieve More</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for your fitness journey
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Fitness Buddy combines personalized workouts, progress tracking, and social motivation to help you reach
            your fitness goals faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.name}
              className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-6 items-center`}
            >
              <div className="w-full md:w-1/2 rounded-xl overflow-hidden">
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.name}
                  width={500}
                  height={300}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold">{feature.name}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FeaturedWorkouts } from "@/components/featured-workouts"
import { HeroBanner } from "@/components/hero-banner"
import { FeatureHighlights } from "@/components/feature-highlights"

export default function Home() {
  return (
    <div className="space-y-10">
      <HeroBanner />
      <FeatureHighlights />
      <section className="container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Featured Workouts</h2>
          <Link href="/workouts">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <FeaturedWorkouts />
      </section>
    </div>
  )
}


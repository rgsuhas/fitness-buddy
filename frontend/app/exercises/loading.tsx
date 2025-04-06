import { Skeleton } from "@/components/ui/skeleton"

export default function ExercisesLoading() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 w-full md:w-1/3" />

        <div className="flex flex-col sm:flex-row gap-2">
          <Skeleton className="h-10 w-full sm:w-[180px]" />
          <Skeleton className="h-10 w-full sm:w-[180px]" />
          <Skeleton className="h-10 w-full sm:w-[180px]" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[300px] w-full" />
        ))}
      </div>
    </div>
  )
}


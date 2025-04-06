"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config?: Record<string, { label: string; color: string }>
  }
>(({ className, config, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full overflow-x-auto", className)}
    {...props}
    style={{
      "--color-users": "hsl(var(--primary))",
      "--color-workouts": "hsl(var(--primary))",
      "--color-plans": "hsl(var(--secondary))",
      "--color-challenges": "hsl(var(--accent))",
      ...Object.fromEntries(
        Object.entries(config ?? {}).map(([key, value]) => [
          `--color-${key}`,
          value.color,
        ])
      ),
    } as React.CSSProperties}
  />
))
ChartContainer.displayName = "ChartContainer"

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            {label}
          </span>
          {payload.map((item: any, idx: number) => (
            <span key={idx} className="font-bold">
              {item.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Export the components defined in this file directly
export { ChartContainer, CustomTooltip }

// Only export ChartTooltipContent from the other file
export { ChartTooltipContent } from './chart-tooltip-content'
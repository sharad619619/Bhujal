"use client"

import * as React from "react"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfidenceBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  confidence: number // 0-100
}

export function ConfidenceBadge({ confidence, className, ...props }: ConfidenceBadgeProps) {
  const [expanded, setExpanded] = React.useState(false)
  
  let colorClass = "bg-red-500"
  if (confidence > 80) colorClass = "bg-green-500"
  else if (confidence >= 50) colorClass = "bg-amber-500"

  return (
    <div
      className={cn("inline-flex items-center cursor-pointer text-xs font-medium text-muted-foreground", className)}
      onClick={() => setExpanded(!expanded)}
      {...props}
    >
      <div className={cn("h-2 w-2 rounded-full mr-1.5", colorClass)} />
      {confidence}% Conf.
      <Info className="ml-1 h-3 w-3" />
      {expanded && (
        <span className="ml-2 text-muted-foreground/80">
          (Confidence level based on data source and age)
        </span>
      )}
    </div>
  )
}

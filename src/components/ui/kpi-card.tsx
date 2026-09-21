import * as React from "react"
import { ArrowDown, ArrowUp, ArrowRight, LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: "up" | "down" | "stable"
  trendValue?: string
  className?: string
}

export function KPICard({ title, value, icon: Icon, trend, trendValue, className }: KPICardProps) {
  return (
    <Card className={cn("border-[#e5e5e5]", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <div className="text-3xl font-bold">{value}</div>
          {trend && trendValue && (
            <div className={cn(
              "flex items-center text-xs font-medium",
              trend === "up" ? "text-red-600" : trend === "down" ? "text-green-600" : "text-muted-foreground"
            )}>
              {trend === "up" && <ArrowUp className="mr-1 h-3 w-3" />}
              {trend === "down" && <ArrowDown className="mr-1 h-3 w-3" />}
              {trend === "stable" && <ArrowRight className="mr-1 h-3 w-3" />}
              {trendValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

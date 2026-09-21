import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-green-800 text-white hover:bg-green-800/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-red-600 text-white hover:bg-red-600/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-600 text-white hover:bg-green-600/80",
        warning: "border-transparent bg-amber-500 text-white hover:bg-amber-500/80",
        info: "border-transparent bg-blue-600 text-white hover:bg-blue-600/80",
        purple: "border-transparent bg-purple-600 text-white hover:bg-purple-600/80",
        verified: "border-transparent bg-green-100 text-green-800 hover:bg-green-100/80",
        reported: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-100/80",
        estimated: "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100/80",
        predicted: "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-100/80",
        unknown: "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-100/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

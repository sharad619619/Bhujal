import * as React from "react"
import { CheckCircle2, MessageCircle, Calculator, BrainCircuit, HelpCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { type DataStatus } from "@/lib/types"

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: DataStatus
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const config: Record<string, { icon: typeof CheckCircle2; variant: string; label: string }> = {
    verified: { icon: CheckCircle2, variant: "verified" as const, label: "Verified" },
    reported: { icon: MessageCircle, variant: "reported" as const, label: "Reported" },
    estimated: { icon: Calculator, variant: "estimated" as const, label: "Estimated" },
    predicted: { icon: BrainCircuit, variant: "predicted" as const, label: "Predicted" },
    pending: { icon: HelpCircle, variant: "warning" as const, label: "Pending" },
    unknown: { icon: HelpCircle, variant: "unknown" as const, label: "Unknown" },
  }

  const { icon: Icon, variant, label } = config[status] || config.unknown

  return (
    <Badge variant={variant as any} className={className} {...props}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  )
}

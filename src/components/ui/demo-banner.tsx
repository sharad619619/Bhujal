"use client"

import * as React from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DemoBanner() {
  const [visible, setVisible] = React.useState(true)

  if (!visible) return null

  return (
    <div className="bg-emerald-950/90 text-emerald-200 border-b border-emerald-800/40 px-4 py-1.5 flex items-center justify-between text-xs font-mono w-full sticky top-0 z-50 backdrop-blur-xs">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-semibold text-white">Dataset status: Demonstration workspace</span> 
        <span className="hidden sm:inline text-emerald-300/70">· Real-time groundwater telemetry and synthetic field observations</span>
      </div>
      <Button variant="ghost" size="icon" onClick={() => setVisible(false)} className="h-5 w-5 text-emerald-300 hover:bg-emerald-900/50 hover:text-white">
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

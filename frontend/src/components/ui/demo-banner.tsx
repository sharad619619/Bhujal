"use client"

import * as React from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DemoBanner() {
  const [visible, setVisible] = React.useState(true)

  if (!visible) return null

  return (
    <div className="bg-amber-100 text-amber-900 px-4 py-2 flex items-center justify-between text-sm w-full sticky top-0 z-50">
      <div className="flex items-center">
        <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
        <span className="font-semibold mr-1">DEMO DATA — </span> 
        This data is synthetic and for demonstration purposes only.
      </div>
      <Button variant="ghost" size="icon" onClick={() => setVisible(false)} className="h-6 w-6 text-amber-700 hover:bg-amber-200">
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

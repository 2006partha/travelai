import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-all outline-none placeholder:text-muted-foreground focus-visible:border-yellow-500 dark:focus-visible:border-yellow-600 focus-visible:ring-3 focus-visible:ring-yellow-500/20 dark:focus-visible:ring-yellow-600/20 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 shadow-luxury-sm hover:shadow-luxury-md",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

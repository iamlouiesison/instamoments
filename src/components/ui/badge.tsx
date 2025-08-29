import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        celebration: "border-transparent bg-[hsl(var(--celebration))] text-[hsl(var(--celebration-foreground))] hover:bg-[hsl(var(--celebration))/80]",
        photo: "border-transparent bg-[hsl(var(--photo-accent))] text-[hsl(var(--photo-accent-foreground))] hover:bg-[hsl(var(--photo-accent))/80]",
        video: "border-transparent bg-[hsl(var(--video-accent))] text-[hsl(var(--video-accent-foreground))] hover:bg-[hsl(var(--video-accent))/80]",
        live: "border-transparent bg-[hsl(var(--live-indicator))] text-[hsl(var(--live-indicator-foreground))] hover:bg-[hsl(var(--live-indicator))/80]",
        success: "border-transparent bg-success text-success-foreground hover:bg-success/80",
        warning: "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
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

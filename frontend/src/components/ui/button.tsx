import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "cyan" | "destructive" | "ghost" | "social"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    
    let variantClasses = ""
    switch(variant) {
      case "default":
        variantClasses = "bg-[#FFD500] text-primary border-border-width border-primary brutal-shadow-hover"
        break
      case "cyan":
        variantClasses = "bg-secondary-container text-on-secondary-container border-border-width border-primary brutal-shadow-cyan-hover"
        break
      case "destructive":
        variantClasses = "bg-error text-on-error border-border-width border-primary brutal-shadow-hover"
        break
      case "ghost":
        variantClasses = "bg-transparent border-border-width border-primary brutal-shadow-hover"
        break
      case "social":
        variantClasses = "bg-surface-container-lowest border-border-width border-primary hover:bg-surface-variant brutal-shadow-hover"
        break
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-100 disabled:opacity-50 disabled:pointer-events-none",
          variantClasses,
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, id, ...props }, ref) => {
    return (
      <div className="flex flex-col brutal-input-container w-full">
        <label 
            htmlFor={id}
            className="font-label-caps text-label-caps uppercase bg-primary text-white border-t-border-width border-x-border-width border-primary px-3 py-1 inline-block w-max transition-colors duration-200"
        >
            {label}
        </label>
        <input
            id={id}
            type={type}
            className={cn(
            "w-full bg-surface-container-lowest border-border-width border-primary p-3 font-body-lg text-body-lg brutal-input transition-all duration-200 focus:outline-none focus:ring-0",
            className
            )}
            ref={ref}
            {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }

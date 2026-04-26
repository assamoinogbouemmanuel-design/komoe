import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Simplistic utility classes for variant and size
    let variantClasses = "bg-brand-orange text-white hover:bg-[#b05020] shadow-sm"
    if (variant === 'destructive') variantClasses = "bg-red-500 text-white hover:bg-red-600 shadow-sm"
    if (variant === 'outline') variantClasses = "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900"
    if (variant === 'secondary') variantClasses = "bg-gray-100 text-gray-900 hover:bg-gray-200"
    if (variant === 'ghost') variantClasses = "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
    if (variant === 'link') variantClasses = "text-brand-orange underline-offset-4 hover:underline"

    let sizeClasses = "h-10 px-4 py-2"
    if (size === 'sm') sizeClasses = "h-9 rounded-md px-3"
    if (size === 'lg') sizeClasses = "h-11 rounded-md px-8"
    if (size === 'icon') sizeClasses = "h-10 w-10"

    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    return (
      <Comp
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

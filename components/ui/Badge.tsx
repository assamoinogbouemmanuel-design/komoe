import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  let variantClasses = "bg-brand-blue text-white" // default look
  if (variant === 'secondary') variantClasses = "bg-gray-100 text-gray-800"
  if (variant === 'destructive') variantClasses = "bg-red-100 text-red-800"
  if (variant === 'outline') variantClasses = "border border-gray-200 text-gray-800"
  if (variant === 'success') variantClasses = "bg-brand-orange/10 text-brand-orange"

  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

  return (
    <div className={`${baseClasses} ${variantClasses} ${className || ''}`} {...props} />
  )
}

export { Badge }

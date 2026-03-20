interface TechBadgeProps {
  name: string
  variant?: 'default' | 'outline'
}

export default function TechBadge({ name, variant = 'default' }: TechBadgeProps) {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors'
  const variantClasses = variant === 'outline'
    ? 'border border-theme-badge text-theme-secondary hover:border-primary-500 hover:text-primary-400'
    : 'bg-theme-badge text-theme-secondary hover:bg-primary-600/20 hover:text-primary-400'

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      {name}
    </span>
  )
}

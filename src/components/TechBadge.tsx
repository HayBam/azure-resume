interface TechBadgeProps {
  name: string
  variant?: 'default' | 'outline'
}

export default function TechBadge({ name, variant = 'default' }: TechBadgeProps) {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors'
  const variantClasses = variant === 'outline'
    ? 'border border-gray-700 text-gray-300 hover:border-primary-500 hover:text-primary-400'
    : 'bg-gray-800/80 text-gray-300 hover:bg-primary-600/20 hover:text-primary-400'

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      {name}
    </span>
  )
}

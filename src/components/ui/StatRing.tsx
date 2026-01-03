interface StatRingProps {
  value: string | number
  unit?: string
  label: string
  icon: string
  iconColor?: string
  size?: 'sm' | 'md'
  color?: 'primary' | 'secondary' | 'accent'
}

export default function StatRing({
  value,
  unit,
  label,
  icon,
  iconColor = 'text-white',
  size = 'md',
  color = 'accent',
}: StatRingProps) {
  const sizeClasses = size === 'sm' ? 'w-32 h-32' : 'w-36 h-36'
  const svgSize = size === 'sm' ? 128 : 144
  const cx = svgSize / 2
  const radius = size === 'sm' ? 58 : 68

  const colorMap = {
    primary: {
      gradient: ['#FF00CC', '#FF66E0'],
      badge: 'bg-primary',
      glow: 'shadow-glow-sm-primary',
    },
    secondary: {
      gradient: ['#00FF66', '#66FFB2'],
      badge: 'bg-secondary',
      glow: 'shadow-glow-sm-secondary',
    },
    accent: {
      gradient: ['#CC00FF', '#FF00CC'],
      badge: 'bg-accent',
      glow: 'shadow-glow-sm-accent',
    },
  }

  const colorConfig = colorMap[color]
  const gradientId = `ring-gradient-${color}`

  return (
    <div className={`relative ${sizeClasses} flex items-center justify-center`}>
      {/* Background ring with dashed gradient */}
      <svg
        className="absolute inset-0 w-full h-full transform -rotate-90"
        viewBox={`0 0 ${svgSize} ${svgSize}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorConfig.gradient[0]} />
            <stop offset="100%" stopColor={colorConfig.gradient[1]} />
          </linearGradient>
        </defs>
        {/* Outer background ring */}
        <circle
          cx={cx}
          cy={cx}
          r={radius}
          fill="none"
          stroke="#2C2C2E"
          strokeWidth={3}
        />
        {/* Dashed gradient ring */}
        <circle
          cx={cx}
          cy={cx}
          r={radius - 4}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={4}
          strokeDasharray="1 4"
          opacity={0.8}
        />
      </svg>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center text-center z-10">
        <div className="flex items-baseline text-white font-bold leading-none">
          {typeof value === 'string' && value.includes('H') ? (
            // Format like "09H 13M"
            <>
              <span className="text-3xl tabular-nums">{value.split('H')[0]}</span>
              <span className="text-xs text-text-secondary mx-0.5">H</span>
              <span className="text-3xl tabular-nums">{value.split('H')[1]?.replace('M', '') || '00'}</span>
              <span className="text-xs text-text-secondary mx-0.5">M</span>
            </>
          ) : (
            <>
              <span className="text-4xl tabular-nums">{value}</span>
              {unit && <span className="text-sm text-text-secondary ml-1">{unit}</span>}
            </>
          )}
        </div>
        <span className="text-[10px] uppercase tracking-wide text-text-secondary mt-1 font-medium max-w-[80px] leading-tight">
          {label}
        </span>
      </div>

      {/* Badge icon */}
      <div className={`absolute -top-1 right-2 w-8 h-8 rounded-full ${colorConfig.badge} border-2 border-black flex items-center justify-center ${colorConfig.glow}`}>
        <span className={`material-icons-round ${iconColor} text-sm font-bold`}>{icon}</span>
      </div>
    </div>
  )
}

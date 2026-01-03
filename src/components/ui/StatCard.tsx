interface StatCardProps {
  icon: string
  label: string
  value: string
  unit?: string
  color: 'primary' | 'secondary'
  progress?: number // 0-100 for progress ring
}

export default function StatCard({
  icon,
  label,
  value,
  unit,
  color,
  progress = 75,
}: StatCardProps) {
  const colorClasses = {
    primary: {
      icon: 'text-primary',
      label: 'text-primary',
      stroke: '#FF00CC',
      glow: 'drop-shadow-[0_0_8px_rgba(255,0,204,0.6)]',
    },
    secondary: {
      icon: 'text-secondary',
      label: 'text-secondary',
      stroke: '#00FF66',
      glow: 'drop-shadow-[0_0_8px_rgba(0,255,102,0.6)]',
    },
  }

  const classes = colorClasses[color]

  // Ring calculations
  const cx = 50
  const cy = 50
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - Math.min(progress, 100) / 100)

  return (
    <div className="aspect-square rounded-[2rem] bg-surface-light p-4 relative flex flex-col items-center justify-center border border-white/5 shadow-lg shadow-black/50 overflow-hidden group">
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Circular progress ring */}
      <div className="relative w-28 h-28">
        <svg className={`w-full h-full transform -rotate-90 ${classes.glow} transition-all duration-1000 ease-out`} viewBox="0 0 100 100">
          {/* Background ring */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#3a3a3c"
            strokeWidth={8}
          />
          {/* Progress ring */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={classes.stroke}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
          <span className="text-3xl font-bold text-white tracking-tighter">{value}</span>
          {unit && <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">{unit}</span>}
        </div>
      </div>

      {/* Bottom label */}
      <div className="mt-2 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
        <span className={`material-icons-round ${classes.icon} text-xs`}>{icon}</span>
        <span className="text-xs text-text-secondary font-medium tracking-wide">{label}</span>
      </div>
    </div>
  )
}

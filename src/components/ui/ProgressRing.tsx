interface ProgressRingProps {
  size: number
  strokeWidth: number
  progress: number // 0-100
  color?: string
  bgColor?: string
  showGlow?: boolean
  children?: React.ReactNode
}

export default function ProgressRing({
  size,
  strokeWidth,
  progress,
  color = '#FA2D48',
  bgColor = '#2C2C2E',
  showGlow = true,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - Math.min(progress, 100) / 100)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 0.5s ease-out',
            filter: showGlow ? `drop-shadow(0 0 8px ${color}80)` : 'none',
          }}
        />
      </svg>
      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

// Dual ring component for Apple Fitness style
interface DualRingProps {
  size: number
  outerProgress: number
  innerProgress: number
  outerColor?: string
  innerColor?: string
}

export function DualProgressRing({
  size,
  outerProgress,
  innerProgress,
  outerColor = '#FA2D48',
  innerColor = '#D2FF0F',
}: DualRingProps) {
  const outerStroke = 10
  const innerStroke = 12
  const gap = 8

  const outerRadius = (size - outerStroke) / 2
  const innerRadius = outerRadius - outerStroke / 2 - gap - innerStroke / 2

  const outerCircumference = 2 * Math.PI * outerRadius
  const innerCircumference = 2 * Math.PI * innerRadius

  const outerOffset = outerCircumference * (1 - outerProgress / 100)
  const innerOffset = innerCircumference * (1 - innerProgress / 100)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Outer ring background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerRadius}
          fill="none"
          stroke={outerColor}
          strokeOpacity={0.2}
          strokeWidth={outerStroke}
        />
        {/* Outer ring progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerRadius}
          fill="none"
          stroke={outerColor}
          strokeWidth={outerStroke}
          strokeLinecap="round"
          strokeDasharray={outerCircumference}
          strokeDashoffset={outerOffset}
          style={{
            transition: 'stroke-dashoffset 0.5s ease-out',
            filter: `drop-shadow(0 0 6px ${outerColor}80)`,
          }}
        />
        {/* Inner ring background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          fill="none"
          stroke={innerColor}
          strokeOpacity={0.2}
          strokeWidth={innerStroke}
        />
        {/* Inner ring progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          fill="none"
          stroke={innerColor}
          strokeWidth={innerStroke}
          strokeLinecap="round"
          strokeDasharray={innerCircumference}
          strokeDashoffset={innerOffset}
          style={{
            transition: 'stroke-dashoffset 0.5s ease-out',
            filter: `drop-shadow(0 0 6px ${innerColor}80)`,
          }}
        />
      </svg>
    </div>
  )
}

interface WorkoutCardProps {
  title: string
  subtitle: string
  icon: string
  tag: string
  color: 'primary' | 'secondary'
  onClick: () => void
}

export default function WorkoutCard({
  title,
  subtitle,
  icon,
  tag,
  color,
  onClick,
}: WorkoutCardProps) {
  const colorClasses = {
    primary: {
      iconBg: 'bg-primary/20',
      iconText: 'text-primary',
      tagBg: 'bg-primary/20 border-primary/20',
      tagText: 'text-primary',
      glow: 'bg-primary/20',
      hoverBorder: 'group-hover:border-primary/50',
      hoverTitle: 'group-hover:text-primary',
    },
    secondary: {
      iconBg: 'bg-secondary/20',
      iconText: 'text-secondary',
      tagBg: 'bg-secondary/20 border-secondary/20',
      tagText: 'text-secondary',
      glow: 'bg-secondary/20',
      hoverBorder: 'group-hover:border-secondary/50',
      hoverTitle: 'group-hover:text-secondary',
    },
  }

  const classes = colorClasses[color]

  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left h-48 active-scale"
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-surface to-black rounded-4xl border border-white/10 ${classes.hoverBorder} transition-colors duration-300`} />

      {/* Glow effect */}
      <div className={`absolute right-[-20px] bottom-[-20px] w-40 h-40 ${classes.glow} rounded-full blur-3xl group-hover:opacity-150 transition-all duration-500`} />

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-between z-10">
        {/* Top row */}
        <div className="flex justify-between items-start">
          <div className={`w-12 h-12 rounded-full ${classes.iconBg} flex items-center justify-center ${classes.iconText} group-hover:scale-110 transition-transform duration-300`}>
            <span className="material-icons-round text-2xl">{icon}</span>
          </div>
          <div className={`px-3 py-1 rounded-full ${classes.tagBg} border backdrop-blur-sm`}>
            <span className={`text-[10px] font-bold ${classes.tagText} tracking-wider uppercase`}>{tag}</span>
          </div>
        </div>

        {/* Bottom row */}
        <div>
          <h3 className={`text-3xl font-bold text-white mb-1 ${classes.hoverTitle} transition-colors`}>
            {title}
          </h3>
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <span className="material-icons-round text-base">timer</span>
            <span>{subtitle}</span>
          </div>
        </div>
      </div>
    </button>
  )
}

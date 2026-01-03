interface DayProgress {
  date: number
  dayName: string
  progress: number // 0-100
  isToday?: boolean
}

interface CalendarStripProps {
  days: DayProgress[]
}

export default function CalendarStrip({ days }: CalendarStripProps) {
  return (
    <div className="bg-surface rounded-2xl p-4 overflow-x-auto no-scrollbar">
      <div className="flex justify-between min-w-full gap-2">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-2 min-w-[3rem]">
            {/* Day name */}
            <span className={`text-xs uppercase ${day.isToday ? 'font-bold text-white' : 'text-text-secondary'}`}>
              {day.dayName}
            </span>

            {/* Date with ring */}
            {day.isToday ? (
              <div className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center text-sm font-bold shadow-glow-accent">
                {day.date}
              </div>
            ) : day.progress > 0 ? (
              <div className="relative w-10 h-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                  <circle
                    cx="20"
                    cy="20"
                    r="14"
                    fill="transparent"
                    stroke="#2C2C2E"
                    strokeWidth="4"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="14"
                    fill="transparent"
                    stroke="#FA2D48"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={88}
                    strokeDashoffset={88 * (1 - day.progress / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                  {day.date}
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-text-tertiary">
                {day.date}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

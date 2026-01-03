interface DayData {
  day: string
  value: number
  isToday?: boolean
}

interface WeeklyChartProps {
  data: DayData[]
  maxValue?: number
}

export default function WeeklyChart({ data, maxValue }: WeeklyChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1)

  return (
    <div className="h-32 w-full flex items-end justify-between gap-2">
      {data.map((day, index) => {
        const heightPercent = (day.value / max) * 100
        const isToday = day.isToday

        return (
          <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
            {/* Bar */}
            <div className="w-full bg-surface-light rounded-t-sm relative h-24 overflow-hidden">
              <div
                className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-300 ${
                  isToday
                    ? 'bg-primary shadow-glow-sm-primary'
                    : 'bg-primary/40 group-hover:bg-primary/60'
                }`}
                style={{ height: `${Math.max(heightPercent, 5)}%` }}
              />
            </div>

            {/* Label */}
            {isToday ? (
              <span className="text-xs font-bold text-white bg-primary w-6 h-6 flex items-center justify-center rounded-full">
                {day.day}
              </span>
            ) : (
              <span className="text-xs text-text-secondary font-medium">
                {day.day}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

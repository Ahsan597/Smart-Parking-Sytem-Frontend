import { useState } from 'react'

export interface BarChartDatum {
  label: string
  value: number
}

function BarChart({ data, ariaLabel }: { data: BarChartDatum[]; ariaLabel: string }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const maxValue = Math.max(1, ...data.map((d) => d.value))

  return (
    <div>
      <div className="flex h-40 items-end gap-1 border-b border-navy-700" role="img" aria-label={ariaLabel}>
        {data.map((d, i) => {
          const heightPercent = (d.value / maxValue) * 100
          const isHovered = hoverIndex === i
          return (
            <div
              key={d.label}
              className="group relative flex h-full flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              onFocus={() => setHoverIndex(i)}
              onBlur={() => setHoverIndex(null)}
              tabIndex={0}
            >
              {isHovered && (
                <div className="absolute bottom-full z-10 mb-1 whitespace-nowrap rounded-md border border-navy-600 bg-navy-800 px-2 py-1 text-xs text-white shadow-lg">
                  <span className="font-semibold">{d.value}</span> at {d.label}
                </div>
              )}
              <div
                className={`w-full rounded-t transition ${isHovered ? 'bg-electric-400' : 'bg-electric-500'}`}
                style={{ height: `${d.value > 0 ? Math.max(heightPercent, 2) : 0}%` }}
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-1">
        {data.map((d, i) => (
          <div key={d.label} className="flex-1 text-center text-[9px] text-slate-500">
            {i % 3 === 0 ? d.label : ''}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BarChart

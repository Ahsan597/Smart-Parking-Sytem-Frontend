const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  AVAILABLE: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  RESERVED: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
  OCCUPIED: 'bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30',
  INACTIVE: 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/30',
  MAINTENANCE: 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/30',
}

const DEFAULT_STYLE = 'bg-electric-500/15 text-electric-400 ring-1 ring-electric-500/30'

function Badge({ label }: { label: string }) {
  const className = STATUS_STYLES[label] ?? DEFAULT_STYLE
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${className}`}>{label}</span>
  )
}

export default Badge

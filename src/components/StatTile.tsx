function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-navy-700 bg-navy-900 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}

export default StatTile

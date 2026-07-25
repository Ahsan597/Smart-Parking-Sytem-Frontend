const spots = [
  { id: 'A-101', status: 'available' as const, plate: '—' },
  { id: 'A-102', status: 'occupied' as const, plate: 'ABC-4821' },
  { id: 'A-103', status: 'reserved' as const, plate: '—' },
  { id: 'A-104', status: 'occupied' as const, plate: 'XYZ-1190' },
]

const statusStyles: Record<(typeof spots)[number]['status'], string> = {
  available: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  occupied: 'bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30',
  reserved: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
}

function Home() {
  return (
    <div className="min-h-screen bg-navy-950">
      <header className="flex items-center justify-between border-b border-navy-700 bg-navy-900 px-6 py-4">
        <h1 className="text-lg font-semibold text-white">Parking Management System</h1>
        <button className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600">
          Add Spot
        </button>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-navy-700 bg-navy-900 p-4">
            <p className="text-sm text-slate-400">Total Spots</p>
            <p className="text-2xl font-semibold text-white">124</p>
          </div>
          <div className="rounded-lg border border-navy-700 bg-navy-900 p-4">
            <p className="text-sm text-slate-400">Occupied</p>
            <p className="text-2xl font-semibold text-electric-400">78</p>
          </div>
          <div className="rounded-lg border border-navy-700 bg-navy-900 p-4">
            <p className="text-sm text-slate-400">Available</p>
            <p className="text-2xl font-semibold text-emerald-400">46</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-navy-700 bg-navy-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-800 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Spot</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Plate</th>
              </tr>
            </thead>
            <tbody>
              {spots.map((spot) => (
                <tr key={spot.id} className="border-t border-navy-700">
                  <td className="px-4 py-3 text-white">{spot.id}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${statusStyles[spot.status]}`}>
                      {spot.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300">{spot.plate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Home

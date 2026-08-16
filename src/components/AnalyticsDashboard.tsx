import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { analyticsService } from '../services/analyticsService'
import SelectField from './SelectField'
import StatTile from './StatTile'
import BarChart from './BarChart'
import ErrorAlert from './ErrorAlert'
import type { BarChartDatum } from './BarChart'
import type { OccupancyReport } from '../types/analytics.types'

interface LocationOption {
  id: string
  name: string
}

function AnalyticsDashboard({ locationOptions }: { locationOptions: LocationOption[] }) {
  const [locationId, setLocationId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const params = { locationId: locationId || undefined, from: from || undefined, to: to || undefined }

  const { data: revenue, isLoading: isLoadingRevenue, error: revenueError } = useFetch(
    () => analyticsService.getRevenue(params),
    [locationId, from, to],
  )
  const { data: occupancy, isLoading: isLoadingOccupancy, error: occupancyError } = useFetch(
    () => analyticsService.getOccupancy(params),
    [locationId, from, to],
  )
  const { data: peakHours, isLoading: isLoadingPeakHours, error: peakHoursError } = useFetch(
    () => analyticsService.getPeakHours(params),
    [locationId, from, to],
  )

  const occupancyList: OccupancyReport[] = Array.isArray(occupancy) ? occupancy : occupancy ? [occupancy] : []

  const peakHourData: BarChartDatum[] = Array.from({ length: 24 }, (_, hour) => {
    const found = peakHours?.find((p) => p.hour === hour)
    return { label: String(hour), value: found?.count ?? 0 }
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-lg border border-navy-700 bg-navy-900 p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="w-full sm:w-56">
          <SelectField id="locationId" label="Location" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
            <option value="">All locations</option>
            {locationOptions.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </SelectField>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:contents">
          <div className="w-full sm:w-40">
            <label htmlFor="from" className="mb-1 block text-sm font-medium text-slate-300">
              From
            </label>
            <input
              id="from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-md border border-navy-600 bg-navy-800 px-3 py-2 text-sm text-white outline-none focus:border-electric-500"
            />
          </div>
          <div className="w-full sm:w-40">
            <label htmlFor="to" className="mb-1 block text-sm font-medium text-slate-300">
              To
            </label>
            <input
              id="to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-md border border-navy-600 bg-navy-800 px-3 py-2 text-sm text-white outline-none focus:border-electric-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-400">Revenue</h3>
        <ErrorAlert message={revenueError} />
        {isLoadingRevenue ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatTile label="Total revenue" value={`Rs ${revenue?.totalRevenue ?? 0}`} />
            <StatTile label="Payments" value={String(revenue?.paymentsCount ?? 0)} />
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-400">Occupancy</h3>
        <ErrorAlert message={occupancyError} />
        {isLoadingOccupancy ? (
          <p className="text-slate-400">Loading...</p>
        ) : occupancyList.length === 0 ? (
          <p className="text-slate-400">No locations in scope.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {occupancyList.map((report) => (
              <div key={report.locationId} className="rounded-lg border border-navy-700 bg-navy-900 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-white">{report.locationName}</p>
                  <p className="text-sm text-slate-400">{report.occupancyRate}% occupied</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
                  <div>
                    <p className="text-lg font-semibold text-emerald-400">{report.available}</p>
                    <p className="text-xs text-slate-500">Available</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-amber-400">{report.reserved}</p>
                    <p className="text-xs text-slate-500">Reserved</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-rose-400">{report.occupied}</p>
                    <p className="text-xs text-slate-500">Occupied</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-400">{report.maintenance}</p>
                    <p className="text-xs text-slate-500">Maintenance</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-400">Peak Hours (check-ins by hour of day)</h3>
        <ErrorAlert message={peakHoursError} />
        {isLoadingPeakHours ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          <div className="rounded-lg border border-navy-700 bg-navy-900 p-4">
            <BarChart data={peakHourData} ariaLabel="Bookings checked in by hour of day, 0 to 23" />
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsDashboard

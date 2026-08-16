import { useState } from 'react'
import type { FormEvent } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { userService } from '../../services/userService'
import FormField from '../../components/FormField'
import ErrorAlert from '../../components/ErrorAlert'

function ManagersPage() {
  const { data: managers, isLoading, error, refetch } = useFetch(() => userService.getManagers(), [])

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await userService.createManager({ fullName, email, password, phone: phone || undefined })
      setFullName('')
      setEmail('')
      setPhone('')
      setPassword('')
      await refetch()
    } catch {
      // toast shown by the response interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-lg border border-navy-700 bg-navy-900 p-4">
        <h2 className="mb-4 text-sm font-medium text-slate-400">Create Manager</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="fullName"
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormField
            id="phone"
            label="Phone (optional)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex items-center gap-4 sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600 disabled:opacity-60"
            >
              {isSubmitting ? 'Creating...' : 'Create Manager'}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-slate-400">Managers</h2>
        <ErrorAlert message={error} />
        {isLoading ? (
          <p className="text-slate-400">Loading managers...</p>
        ) : !managers || managers.length === 0 ? (
          <p className="text-slate-400">No managers yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-navy-700 bg-navy-900">
            <table className="w-full min-w-120 text-left text-sm">
              <thead className="bg-navy-800 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((manager) => (
                  <tr key={manager.id} className="border-t border-navy-700">
                    <td className="px-4 py-3 text-white">{manager.fullName}</td>
                    <td className="px-4 py-3 text-slate-300">{manager.email}</td>
                    <td className="px-4 py-3 text-slate-300">{manager.phone ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManagersPage

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../hooks/useAuth'
import { userService } from '../services/userService'
import FormField from '../components/FormField'
import ErrorAlert from '../components/ErrorAlert'
import Badge from '../components/Badge'

function ProfilePage() {
  const { updateUser } = useAuth()
  const { data: profile, isLoading, error, refetch } = useFetch(() => userService.getMe(), [])

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setFullName(profile?.fullName ?? '')
    setPhone(profile?.phone ?? '')
    setProfilePicture(profile?.profilePicture ?? '')
  }, [profile])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      const updated = await userService.updateMe({
        fullName,
        phone: phone || undefined,
        profilePicture: profilePicture || undefined,
      })
      updateUser({ fullName: updated.fullName })
      await refetch()
    } catch {
      // toast shown by the response interceptor
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <p className="text-slate-400">Loading profile...</p>
  if (error) return <ErrorAlert message={error} />
  if (!profile) return null

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold text-white">My Profile</h2>
        <p className="text-sm text-slate-400">{profile.email}</p>
        <div className="mt-2">
          <Badge label={profile.role} />
        </div>
      </div>

      <div className="max-w-lg rounded-lg border border-navy-700 bg-navy-900 p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField
            id="fullName"
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <FormField id="phone" label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <FormField
            id="profilePicture"
            label="Profile Picture URL"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600 disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage

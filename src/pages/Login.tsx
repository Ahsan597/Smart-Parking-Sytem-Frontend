import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../services/errorUtils'
import AuthCard from '../components/AuthCard'
import FormField from '../components/FormField'
import ErrorAlert from '../components/ErrorAlert'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login({ email, password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard title="Log in">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <ErrorAlert message={error} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-electric-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-electric-600 disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
        <p className="text-center text-sm text-slate-400">
          No account?{' '}
          <Link to="/register" className="text-electric-400 hover:text-electric-300">
            Register
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}

export default Login

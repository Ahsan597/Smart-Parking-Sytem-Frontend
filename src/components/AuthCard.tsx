import type { ReactNode } from 'react'

function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-sm rounded-lg border border-navy-700 bg-navy-900 p-6">
        <h1 className="mb-6 text-xl font-semibold text-white">{title}</h1>
        {children}
      </div>
    </div>
  )
}

export default AuthCard

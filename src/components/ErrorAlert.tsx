function ErrorAlert({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <div className="rounded-md bg-rose-500/15 px-3 py-2 text-sm text-rose-400 ring-1 ring-rose-500/30">
      {message}
    </div>
  )
}

export default ErrorAlert

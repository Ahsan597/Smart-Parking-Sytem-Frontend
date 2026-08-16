import type { MouseEvent, ReactNode } from 'react'

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  function stopPropagation(event: MouseEvent) {
    event.stopPropagation()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-navy-700 bg-navy-900 p-4 sm:p-6"
        onClick={stopPropagation}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal

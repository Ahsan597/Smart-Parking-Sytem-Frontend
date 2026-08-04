import type { SelectHTMLAttributes, ReactNode } from 'react'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  children: ReactNode
}

function SelectField({ label, id, children, ...selectProps }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <select
        id={id}
        className="rounded-md border border-navy-600 bg-navy-800 px-3 py-2 text-sm text-white outline-none focus:border-electric-500"
        {...selectProps}
      >
        {children}
      </select>
    </div>
  )
}

export default SelectField

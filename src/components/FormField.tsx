import type { InputHTMLAttributes } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

function FormField({ label, id, ...inputProps }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        id={id}
        className="rounded-md border border-navy-600 bg-navy-800 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-electric-500"
        {...inputProps}
      />
    </div>
  )
}

export default FormField

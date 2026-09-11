import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = ({
  label,
  error,
  id,
  className = '',
  ...props
}: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--foreground)]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] ${className}`}
        {...props}
      />

      {error && (
        <span className="text-sm text-[var(--danger)]">
          {error}
        </span>
      )}
    </div>
  )
}

export default Input
import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const variantStyles = {
    primary:
      'bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]',
    secondary:
      'border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--surface)]',
    danger:
      'bg-[var(--danger)] text-[var(--primary-foreground)] hover:opacity-90',
    ghost:
      'bg-transparent text-[var(--foreground)] hover:bg-[var(--surface)]',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
    icon: 'h-10 w-10 p-0 text-lg',
  }

  return (
    <button
      className={`inline-flex items-center justify-center rounded-[--radius-md] font-medium transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </button>
  )
}

export default Button
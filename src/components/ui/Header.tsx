import Button from './Button'
import {
  Menu,
  Search,
  User,
  Heart,
  ShoppingCart,
  LogOut,
} from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useFavorites } from '../../hooks/useFavorites'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'

const Header = () => {
  const navigate = useNavigate()

  const { totalItems } = useCart()
  const { items } = useFavorites()
  const { user, signout } = useAuth()

  const [isAccountOpen, setIsAccountOpen] = useState(false)

  const totalFavorites = items.length

  const accountMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isAccountOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isAccountOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="relative mx-auto h-20 max-w-7xl px-4">

        <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-0">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir menú"
            className="!h-7 !w-7 !p-0"
          >
            <Menu size={24} strokeWidth={1.7} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Buscar productos"
            className="!h-7 !w-7 !p-0"
            onClick={() => navigate('/catalog')}
          >
            <Search size={24} strokeWidth={1.7} />
          </Button>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Ir al inicio"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <span className="block font-brand text-5xl font-normal leading-none tracking-tight text-[var(--foreground)]">
              SAVIA
            </span>

            <span className="block text-[9px] uppercase tracking-widest text-[var(--muted)]">
              Espacios vivos
            </span>
          </button>
        </div>

        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-0">
          <div ref={accountMenuRef} className="relative">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Mi cuenta"
              className="relative !h-7 !w-7 !p-0"
              onClick={() => {
                if (!user) {
                  navigate('/login')
                  return
                }

                setIsAccountOpen((current) => !current)
              }}
            >
              <User size={24} strokeWidth={1.7} />
            </Button>

            {user && isAccountOpen && (
              <div className="absolute right-0 top-10 z-50 w-64 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 shadow-lg">
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {user.displayName}
                  </p>

                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {user.email}
                  </p>
                </div>

                {user.role === 'admin' && (
                  <Button
                    variant="ghost"
                    size="md"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      setIsAccountOpen(false)
                      navigate('/admin/products')
                    }}
                  >
                    Panel de administración
                  </Button>
                )}

                <div className="my-3 border-t border-[var(--border)]" />
                <Button
                  variant="ghost"
                  size="md"
                  className="w-full text-sm gap-3"
                  onClick={async () => {
                    await signout()
                    setIsAccountOpen(false)
                  }}
                >
                  <LogOut size={15} strokeWidth={1.7} />
                  <span>Cerrar sesión</span>
                </Button>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Favoritos"
            className="relative !h-7 !w-7 !p-0"
            onClick={() => navigate('/favorites')}
          >
            <Heart size={24} strokeWidth={1.7} />

            {totalFavorites > 0 && (
              <span className="absolute right-0 top-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[var(--primary)] px-0.5 text-[9px] font-bold leading-none text-[var(--primary-foreground)]">
                {totalFavorites}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Carrito"
            className="relative !h-7 !w-7 !p-0"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart size={24} strokeWidth={1.7} />

            {totalItems > 0 && (
              <span className="absolute right-0 top-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[var(--primary)] px-0.5 text-[9px] font-bold leading-none text-[var(--primary-foreground)]">
                {totalItems}
              </span>
            )}
          </Button>
        </div>

      </div>
    </header>
  )
}

export default Header
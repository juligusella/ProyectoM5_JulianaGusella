import Button from './Button'

import {
  Menu,
  Search,
  User,
  ShoppingCart,
} from 'lucide-react'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-3 items-center px-4">

        {/* Left actions */}
        <div className="flex items-center gap-0">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Buscar productos"
          >
            <Search size={24} />      
          </Button>
        </div>

        {/* Logo */}
        <div className="text-center">
          <span className="block font-brand text-5xl font-normal tracking-tight text-[var(--foreground)]">
            SAVIA
          </span>

          <span className="block text-xs uppercase tracking-widest text-[var(--muted)]">
            Espacios vivos
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center justify-end gap-0">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Mi cuenta"
          >
            <User size={24} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Carrito"
          >
            <ShoppingCart size={24} />
          </Button>
        </div>

      </div>
    </header>
  )
}

export default Header
import Button from './Button'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-3 items-center px-4">
        {/* Left actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir menú"
          >
            ☰
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Buscar productos"
          >
            ⌕
          </Button>
        </div>

        {/* Logo */}
        <div className="text-center">
          <span className="font-serif text-2xl font-medium tracking-tight text-[var(--foreground)]">
            SAVIA
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Mi cuenta"
          >
            ♙
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Carrito"
          >
            ♡
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
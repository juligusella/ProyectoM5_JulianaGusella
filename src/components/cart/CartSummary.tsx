import Button from '../ui/Button'

interface CartSummaryProps {
  total: number
  totalItems: number
  clearCart: () => void
}

const CartSummary = ({
  total,
  totalItems,
  clearCart,
}: CartSummaryProps) => {
  return (
    <section className="mt-8 border-t border-[var(--border)] pt-6">
      <div className="flex justify-between text-sm text-[var(--muted)]">
        <span>Productos</span>
        <span>{totalItems}</span>
      </div>

      <div className="mt-2 flex justify-between">
        <span className="font-medium text-[var(--foreground)]">
          Total
        </span>

        <span className="font-bold text-[var(--foreground)]">
          {new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
          }).format(total)}
        </span>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="ghost" onClick={clearCart}>
          Vaciar carrito
        </Button>
      </div>
    </section>
  )
}

export default CartSummary
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

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

      <div className="mt-6 flex flex-col items-end gap-2">
        <Button
          variant="ghost"
          onClick={clearCart}
        >
          Vaciar carrito
        </Button>
      </div>

      <div className="mt-6 space-y-2">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => navigate('/checkout')}
        >
          Finalizar compra
        </Button>

        <Button
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/catalog')}
        >
          Seguir comprando
        </Button>
      </div>
    </section>
  )
}

export default CartSummary
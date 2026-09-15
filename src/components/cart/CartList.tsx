import { useCart } from '../../hooks/useCart'
import Button from '../ui/Button'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import { useNavigate } from 'react-router-dom'

export function CartList() {
  const {
    items,
    total,
    totalItems,
    clearCart,
  } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <section className="px-4 py-8">
        <h1 className="font-serif text-2xl text-[var(--foreground)]">
          Tu carrito
        </h1>

        <p className="mt-6 text-sm text-[var(--muted)]">
          Tu carrito está vacío.
        </p>

        <Button
          variant="primary"
          className="mt-6"
          onClick={() => navigate('/catalog')}
        >
          Seguir comprando
        </Button>
      </section>
    )
  }

  return (
    <section className="px-4 py-8">
      <h1 className="font-serif text-2xl text-[var(--foreground)]">
        Tu carrito
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        {items.map((item) => (
          <CartItem
            key={item.productId}
            item={item}
          />
        ))}
      </div>

      <CartSummary
        total={total}
        totalItems={totalItems}
        clearCart={clearCart}
      />
    </section>
  )
}

export default CartList
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import Button from '../../components/ui/Button'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { useOrders } from '../../hooks/useOrders'
import { useProducts } from '../../hooks/useProducts'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
})

const Checkout = () => {
    const navigate = useNavigate()

    const { items, total, totalItems, clearCart } = useCart()
    const { user, loading } = useAuth()
    const { createOrder, isSubmitting, clearError } = useOrders()
    const { loadProducts } = useProducts()

    const [checkoutError, setCheckoutError] = useState<string | null>(null)


    async function handleCheckout() {
        if (loading || isSubmitting) {
            return
        }

        if (!user) {
            navigate('/login')
            return
        }

        if (items.length === 0) {
            return
        }

        clearError()
        setCheckoutError(null)

        try {
            const orderId = await createOrder({
                userId: user.uid,
                items,
            })

            if (!orderId) {
                return
            }

            clearCart()

            try {
                await loadProducts()
            } catch (refreshError) {
                console.error(
                    'No se pudo actualizar el catálogo:',
                    refreshError,
                )
            }

            navigate(`/checkout/success/${orderId}`)
        } catch (checkoutException) {
            setCheckoutError(
                checkoutException instanceof Error
                    ? checkoutException.message
                    : 'No pudimos confirmar la compra. Tu carrito sigue guardado; intentá nuevamente.',
            )
        }
    }


    if (items.length === 0) {
        return (
            <main className="px-4 py-8">
                <h1 className="font-serif text-2xl text-[var(--foreground)]">
                    Checkout
                </h1>

                <p className="mt-6 text-sm text-[var(--muted)]">
                    No hay productos para comprar.
                </p>

                <Button
                    variant="primary"
                    className="mt-6"
                    onClick={() => navigate('/catalog')}
                >
                    Seguir comprando
                </Button>
            </main>
        )
    }

    return (
        <main className="px-4 py-8">
            <Button
                variant="ghost"
                onClick={() => navigate('/cart')}
                className="mb-6"
                disabled={isSubmitting}
            >
                <ArrowLeft size={16} />
                Volver al carrito
            </Button>

            <h1 className="font-serif text-2xl text-[var(--foreground)]">
                Finalizar compra
            </h1>

            <section className="mt-8">
                <h2 className="font-serif text-lg text-[var(--foreground)]">
                    Resumen del pedido
                </h2>

                <div className="mt-4 space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.productId}
                            className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-3"
                        >
                            <div>
                                <p className="text-sm font-medium uppercase text-[var(--foreground)]">
                                    {item.name}
                                </p>

                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    Cantidad: {item.quantity}
                                </p>
                            </div>

                            <p className="text-sm font-semibold text-[var(--foreground)]">
                                {currencyFormatter.format(
                                    item.price * item.quantity,
                                )}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-[var(--muted)]">
                        {totalItems} productos
                    </span>

                    <span className="font-serif text-xl text-[var(--foreground)]">
                        {currencyFormatter.format(total)}
                    </span>
                </div>
            </section>

            <section className="mt-10">
                <h2 className="font-serif text-lg text-[var(--foreground)]">
                    Datos de compra
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    Confirmá tu pedido para registrar la compra y actualizar
                    el stock disponible.
                </p>

                {checkoutError && (
                    <p
                        role="alert"
                        className="mt-4 text-sm text-red-700"
                    >
                        {checkoutError}
                    </p>
                )}

                <Button
                    variant="primary"
                    className="mt-6 w-full"
                    onClick={handleCheckout}
                    disabled={loading || isSubmitting || items.length === 0}
                >
                    {loading
                        ? 'Verificando usuario...'
                        : isSubmitting
                            ? 'Procesando compra...'
                            : 'Confirmar compra'}
                </Button>
            </section>
        </main>
    )
}

export default Checkout
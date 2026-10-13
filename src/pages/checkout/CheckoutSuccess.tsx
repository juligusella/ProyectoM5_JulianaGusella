import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Package } from 'lucide-react'

import Button from '../../components/ui/Button'
import { useOrders } from '../../hooks/useOrders'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
})

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'long',
    timeStyle: 'short',
})

const CheckoutSuccess = () => {
    const { orderId } = useParams<{ orderId: string }>()
    const navigate = useNavigate()

    const {
        currentOrder,
        isLoading,
        error,
        loadOrder,
        clearCurrentOrder,
        clearError,
    } = useOrders()

    useEffect(() => {
        if (!orderId) {
            return
        }

        void loadOrder(orderId)

        return () => {
            clearCurrentOrder()
            clearError()
        }
    }, [orderId])

    if (!orderId) {
        return (
            <main className="px-4 py-12 text-center">
                <p className="text-sm text-[var(--muted)]">
                    No encontramos el identificador de la orden.
                </p>
                <Button
                    variant="primary"
                    className="mt-6"
                    onClick={() => navigate('/catalog')}
                >
                    Volver al catálogo
                </Button>
            </main>
        )
    }

    if (isLoading) {
        return (
            <main className="px-4 py-12 text-center">
                <p className="text-sm text-[var(--muted)]">
                    Cargando los datos de tu compra...
                </p>
            </main>
        )
    }

    if (error || !currentOrder || currentOrder.id !== orderId) {
        return (
            <main className="px-4 py-12 text-center">
                <h1 className="font-serif text-2xl text-[var(--foreground)]">
                    No pudimos cargar tu orden
                </h1>
                <p className="mt-4 text-sm text-[var(--muted)]">
                    {error ?? 'No encontramos los datos de esta compra.'}
                </p>
                <Button
                    variant="primary"
                    className="mt-6"
                    onClick={() => navigate('/catalog')}
                >
                    Volver al catálogo
                </Button>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-2xl px-4 py-10">
            <section className="text-center">
                <CheckCircle2
                    size={44}
                    strokeWidth={1.5}
                    className="mx-auto text-[var(--foreground)]"
                />

                <h1 className="mt-4 font-serif text-3xl text-[var(--foreground)]">
                    ¡Gracias por tu compra!
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                    Tu pedido quedó registrado correctamente.
                </p>
            </section>

            <section className="mt-8 border border-[var(--border)] p-5">
                <div className="flex items-center gap-3">
                    <Package size={22} className="text-[var(--foreground)]" />
                    <h2 className="font-serif text-xl text-[var(--foreground)]">
                        Resumen del pedido
                    </h2>
                </div>

                <p className="mt-5 break-all text-sm text-[var(--muted)]">
                    Número de orden: <span className="font-medium text-[var(--foreground)]">{currentOrder.id}</span>
                </p>

                <p className="mt-3 text-sm text-[var(--muted)]">
                    Estado: <span className="font-medium text-[var(--foreground)]">{currentOrder.status}</span>
                </p>

                <p className="mt-3 text-sm text-[var(--muted)]">
                    Fecha: {dateFormatter.format(currentOrder.createdAt)}
                </p>

                <div className="mt-6 space-y-4">
                    {currentOrder.items.map((item, index) => (
                        <div
                            key={`${item.productId} -${index} `}
                            className="flex items-center gap-3 border-b border-[var(--border)] pb-4"
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-16 w-16 rounded-sm object-cover"
                            />

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium uppercase text-[var(--foreground)]">
                                    {item.name}
                                </p>
                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    Cantidad: {item.quantity}
                                </p>
                            </div>

                            <p className="text-sm font-medium text-[var(--foreground)]">
                                {currencyFormatter.format(
                                    item.priceAtPurchase * item.quantity,
                                )}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-[var(--muted)]">
                        Total del pedido
                    </span>
                    <span className="font-serif text-xl text-[var(--foreground)]">
                        {currencyFormatter.format(currentOrder.total)}
                    </span>
                </div>
            </section>

            <Button
                variant="primary"
                className="mt-8 w-full"
                onClick={() => navigate('/catalog')}
            >
                Seguir explorando SAVIA
            </Button>
        </main>
    )
}

export default CheckoutSuccess
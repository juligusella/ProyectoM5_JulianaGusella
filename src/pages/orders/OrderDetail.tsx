import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import Button from '../../components/ui/Button'
import { useOrders } from '../../hooks/useOrders'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
})

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
})

export default function OrderDetailPage() {
    const { orderId } = useParams<{ orderId: string }>()

    const {
        currentOrder,
        isLoading,
        error,
        loadOrder,
    } = useOrders()

    useEffect(() => {
        if (!orderId) return

        void loadOrder(orderId)
    }, [orderId])

    if (isLoading) {
        return (
            <main className="px-4 py-8">
                <p className="text-sm text-[var(--muted)]">
                    Cargando pedido...
                </p>
            </main>
        )
    }

    if (error) {
        return (
            <main className="px-4 py-8">
                <h1 className="font-serif text-2xl text-[var(--foreground)]">
                    Detalle del pedido
                </h1>
                <p role="alert" className="mt-4 text-sm text-red-700">
                    {error}
                </p>
                <Link
                    to="/orders"
                    className="mt-6 inline-block text-sm underline"
                >
                    Volver a mis pedidos
                </Link>
            </main>
        )
    }

    if (!currentOrder || currentOrder.id !== orderId) {
        return (
            <main className="px-4 py-8">
                <h1 className="font-serif text-2xl text-[var(--foreground)]">
                    Pedido no encontrado
                </h1>
                <p className="mt-3 text-sm text-[var(--muted)]">
                    No pudimos encontrar ese pedido.
                </p>
                <Link
                    to="/orders"
                    className="mt-6 inline-block text-sm underline"
                >
                    Volver a mis pedidos
                </Link>
            </main>
        )
    }

    return (
        <main className="px-4 py-8">
            <Link
                to="/orders"
                className="text-sm text-[var(--muted)] underline"
            >
                ← Volver a mis pedidos
            </Link>

            <h1 className="mt-6 font-serif text-2xl text-[var(--foreground)]">
                Detalle del pedido
            </h1>

            <section className="mt-6 border border-[var(--border)] p-4">
                <p className="break-all text-sm text-[var(--muted)]">
                    Número de pedido: {currentOrder.id}
                </p>

                <p className="mt-3 text-sm text-[var(--foreground)]">
                    Estado: {currentOrder.status}
                </p>

                <p className="mt-2 text-sm text-[var(--muted)]">
                    Fecha:{' '}
                    {currentOrder.createdAt instanceof Date
                        ? dateFormatter.format(currentOrder.createdAt)
                        : 'Sin fecha'}
                </p>

                <h2 className="mt-6 font-serif text-lg text-[var(--foreground)]">
                    Productos
                </h2>

                <ul className="mt-3 divide-y divide-[var(--border)]">
                    {currentOrder.items.map((item) => (
                        <li
                            key={item.productId}
                            className="flex items-start justify-between gap-3 py-3"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-[var(--foreground)]">
                                    {item.name}
                                </p>
                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    Cantidad: {item.quantity}
                                </p>
                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    Precio unitario:{' '}
                                    {currencyFormatter.format(item.priceAtPurchase)}
                                </p>
                            </div>

                            <p className="shrink-0 text-sm text-[var(--foreground)]">
                                {currencyFormatter.format(
                                    item.priceAtPurchase * item.quantity,
                                )}
                            </p>
                        </li>
                    ))}
                </ul>

                <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
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
                className="mt-6 w-full"
                onClick={() => {
                    window.location.href = '/catalog'
                }}
            >
                Seguir explorando SAVIA
            </Button>
        </main>
    )
}
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import { useOrders } from '../../hooks/useOrders'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
})

export default function OrdersPage() {
    const { user } = useAuth()
    const {
        userOrders,
        isLoading,
        error,
        loadUserOrders,
    } = useOrders()

    useEffect(() => {
        if (!user?.uid) return

        void loadUserOrders(user.uid)
    }, [user?.uid])

    if (isLoading) {
        return (
            <main className="px-4 py-8">
                <p className="text-sm text-[var(--muted)]">
                    Cargando tus pedidos...
                </p>
            </main>
        )
    }

    if (error) {
        return (
            <main className="px-4 py-8">
                <h1 className="font-serif text-2xl text-[var(--foreground)]">
                    Mis pedidos
                </h1>

                <p role="alert" className="mt-4 text-sm text-red-700">
                    {error}
                </p>

                <button
                    type="button"
                    onClick={() => {
                        if (user) void loadUserOrders(user.uid)
                    }}
                    className="mt-4 text-sm underline"
                >
                    Intentar nuevamente
                </button>
            </main>
        )
    }

    return (
        <main className="px-4 py-8">
            <h1 className="font-serif text-2xl text-[var(--foreground)]">
                Mis pedidos
            </h1>

            {userOrders.length === 0 ? (
                <section className="mt-6">
                    <p className="text-sm text-[var(--muted)]">
                        Todavía no tenés pedidos.
                    </p>

                    <Link
                        to="/catalog"
                        className="mt-4 inline-block text-sm underline"
                    >
                        Explorar productos
                    </Link>
                </section>
            ) : (
                <ul className="mt-6 divide-y divide-[var(--border)]">
                    {userOrders.map((order) => (
                        <li key={order.id} className="py-5">
                            <Link
                                to={`/orders/${order.id}`}
                                className="font-medium text-[var(--foreground)] underline"
                            >
                                Pedido #{order.id}
                            </Link>

                            <p className="mt-2 text-sm text-[var(--muted)]">
                                Estado: {order.status}
                            </p>

                            <p className="mt-1 text-sm text-[var(--foreground)]">
                                Total: {currencyFormatter.format(order.total)}
                            </p>

                            <p className="mt-1 text-xs text-[var(--muted)]">
                                Fecha:{' '}
                                {order.createdAt instanceof Date
                                    ? order.createdAt.toLocaleString('es-AR')
                                    : 'Sin fecha'}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    )
}
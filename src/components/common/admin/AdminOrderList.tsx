import { useEffect, useState } from 'react'

import { useOrders } from '../../../hooks/useOrders'
import type { OrderStatus } from '../../../types/order'
import {
    canTransition,
    transitions,
} from '../../../types/orderTransitions'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
})

const statusLabels: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    processing: 'En preparación',
    completed: 'Completado',
    cancelled: 'Cancelado',
}

export function AdminOrderList() {
    const {
        adminOrders,
        isLoading,
        isSubmitting,
        error,
        loadAdminOrders,
        updateOrderStatus,
    } = useOrders()

    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

    useEffect(() => {
        void loadAdminOrders({
            status: statusFilter === 'all' ? undefined : statusFilter,
        })
    }, [statusFilter])

    async function handleStatusChange(
        orderId: string,
        currentStatus: OrderStatus,
        nextStatus: OrderStatus,
    ) {
        if (!canTransition(currentStatus, nextStatus)) return

        await updateOrderStatus(orderId, nextStatus)

        await loadAdminOrders({
            status: statusFilter === 'all' ? undefined : statusFilter,
        })
    }

    return (
        <section className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-[var(--foreground)]">
                    Pedidos
                </h1>
                <p className="mt-2 text-sm text-[var(--muted)]">
                    Administrá los pedidos realizados en SAVIA.
                </p>
            </div>

            <div>
                <label
                    htmlFor="order-status-filter"
                    className="mb-2 block text-sm text-[var(--foreground)]"
                >
                    Filtrar por estado
                </label>

                <select
                    id="order-status-filter"
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value as OrderStatus | 'all')
                    }
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
                >
                    <option value="all">Todos los pedidos</option>
                    <option value="pending">Pendientes</option>
                    <option value="processing">En preparación</option>
                    <option value="completed">Completados</option>
                    <option value="cancelled">Cancelados</option>
                </select>
            </div>

            {isLoading && (
                <p className="text-sm text-[var(--muted)]">
                    Cargando pedidos...
                </p>
            )}

            {!isLoading && error && (
                <div>
                    <p role="alert" className="text-sm text-red-700">
                        {error}
                    </p>
                    <button
                        type="button"
                        onClick={() =>
                            void loadAdminOrders({
                                status:
                                    statusFilter === 'all'
                                        ? undefined
                                        : statusFilter,
                            })
                        }
                        className="mt-2 text-sm underline"
                    >
                        Intentar nuevamente
                    </button>
                </div>
            )}

            {!isLoading && !error && adminOrders.length === 0 && (
                <p className="text-sm text-[var(--muted)]">
                    No hay pedidos para este filtro.
                </p>
            )}

            {!isLoading && !error && adminOrders.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-[var(--border)]">
                                <th className="px-2 py-3">Pedido</th>
                                <th className="px-2 py-3">Usuario</th>
                                <th className="px-2 py-3">Total</th>
                                <th className="px-2 py-3">Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {adminOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-b border-[var(--border)]"
                                >
                                    <td className="break-all px-2 py-3">
                                        {order.id}
                                    </td>
                                    <td className="break-all px-2 py-3">
                                        {order.userId}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-3">
                                        {currencyFormatter.format(order.total)}
                                    </td>
                                    <td className="px-2 py-3">
                                        <select
                                            aria-label={`Estado del pedido ${order.id}`}
                                            value={order.status}
                                            disabled={isSubmitting}
                                            onChange={(event) =>
                                                void handleStatusChange(
                                                    order.id,
                                                    order.status,
                                                    event.target.value as OrderStatus,
                                                )
                                            }
                                            className="max-w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1"
                                        >
                                            <option value={order.status}>
                                                {statusLabels[order.status]}
                                            </option>

                                            {transitions[order.status].map(
                                                (nextStatus) => (
                                                    <option
                                                        key={nextStatus}
                                                        value={nextStatus}
                                                    >
                                                        {statusLabels[nextStatus]}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}
import { useState } from 'react'

import {
    createOrderFromCart,
    getOrderById,
    getOrdersByUser,
    listOrdersAdmin,
    updateOrderStatusAdmin,
} from '../../services/orders/orderService'

import type { Order, OrderStatus } from '../../types/order'
import { OrdersContext } from './OrdersContext'

import type {
    CreateOrderParams,
    LoadAdminOrdersParams,
    OrdersProviderProps,
} from './OrdersContext.types'

export function OrdersProvider({ children }: OrdersProviderProps) {

    const [userOrders, setUserOrders] = useState<Order[]>([])
    const [adminOrders, setAdminOrders] = useState<Order[]>([])
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function executeLoading(
        action: () => Promise<void>,
        errorMessage: string,
    ): Promise<void> {
        try {
            setIsLoading(true)
            setError(null)
            await action()
        } catch (error) {
            console.error(error)
            setError(
                error instanceof Error ? error.message : errorMessage,
            )
        } finally {
            setIsLoading(false)
        }
    }

    async function executeSubmitting<T>(
        action: () => Promise<T>,
        errorMessage: string,
    ): Promise<T | undefined> {
        if (isSubmitting) {
            return undefined
        }

        setIsSubmitting(true)
        setError(null)

        try {
            return await action()
        } catch (caughtError) {
            console.error(caughtError)

            const message =
                caughtError instanceof Error
                    ? caughtError.message
                    : errorMessage

            setError(message)
            throw new Error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    async function loadUserOrders(userId: string): Promise<void> {
        await executeLoading(async () => {
            const orders = await getOrdersByUser(userId)
            setUserOrders(orders)
        }, 'No pudimos cargar tus órdenes.')
    }

    async function loadAdminOrders(
        params?: LoadAdminOrdersParams,
    ): Promise<void> {
        await executeLoading(async () => {
            const orders = await listOrdersAdmin(params)
            setAdminOrders(orders)
        }, 'No pudimos cargar las órdenes.')
    }

    async function loadOrder(orderId: string): Promise<void> {
        await executeLoading(async () => {
            const order = await getOrderById(orderId)

            if (!order) {
                setCurrentOrder(null)
                throw new Error('Orden no encontrada.')
            }

            setCurrentOrder(order)
        }, 'No pudimos cargar la orden.')
    }

    async function createOrder(
        params: CreateOrderParams,
    ): Promise<string | undefined> {
        return executeSubmitting(async () => {
            const orderId = await createOrderFromCart(params)

            const order = await getOrderById(orderId)

            if (!order) {
                throw new Error(
                    'La orden se creó, pero no pudimos recuperar sus datos.',
                )
            }

            setCurrentOrder(order)
            setUserOrders((previousOrders) => [
                order,
                ...previousOrders.filter(
                    (previousOrder) => previousOrder.id !== order.id,
                ),
            ])

            return orderId
        }, 'No pudimos crear la orden.')
    }

    async function updateOrderStatus(
        orderId: string,
        status: OrderStatus,
    ): Promise<void> {
        await executeSubmitting(async () => {
            await updateOrderStatusAdmin(orderId, status)

            setAdminOrders((previousOrders) =>
                previousOrders.map((order) =>
                    order.id === orderId
                        ? { ...order, status }
                        : order,
                ),
            )

            setUserOrders((previousOrders) =>
                previousOrders.map((order) =>
                    order.id === orderId
                        ? { ...order, status }
                        : order,
                ),
            )

            setCurrentOrder((previousOrder) =>
                previousOrder?.id === orderId
                    ? { ...previousOrder, status }
                    : previousOrder,
            )
        }, 'No pudimos actualizar la orden.')
    }

    function clearCurrentOrder(): void {
        setCurrentOrder(null)
    }

    function clearOrders(): void {
        setUserOrders([])
        setAdminOrders([])
        setCurrentOrder(null)
    }

    function clearError(): void {
        setError(null)
    }

    return (
        <OrdersContext.Provider
            value={{
                userOrders,
                adminOrders,
                currentOrder,
                isLoading,
                isSubmitting,
                error,
                loadUserOrders,
                loadAdminOrders,
                loadOrder,
                createOrder,
                updateOrderStatus,
                clearCurrentOrder,
                clearOrders,
                clearError,
            }}
        >
            {children}
        </OrdersContext.Provider>
    )
}

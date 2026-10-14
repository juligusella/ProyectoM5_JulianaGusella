
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { OrdersProvider } from '../contexts/orders/OrdersProvider'
import { useOrders } from '../hooks/useOrders'
import type { Order } from '../types/order'

const mocks = vi.hoisted(() => ({
    createOrderFromCart: vi.fn(),
    getOrderById: vi.fn(),
    getOrdersByUser: vi.fn(),
    listOrdersAdmin: vi.fn(),
    updateOrderStatusAdmin: vi.fn(),
}))

vi.mock('../services/orders/orderService', () => ({
    createOrderFromCart: mocks.createOrderFromCart,
    getOrderById: mocks.getOrderById,
    getOrdersByUser: mocks.getOrdersByUser,
    listOrdersAdmin: mocks.listOrdersAdmin,
    updateOrderStatusAdmin: mocks.updateOrderStatusAdmin,
}))

function wrapper({ children }: { children: ReactNode }) {
    return <OrdersProvider>{children}</OrdersProvider>
}

const orderFixture = {
    id: 'order-test-1',
    userId: 'customer-test-1',
    status: 'pending',
    items: [],
    total: 15000,
    createdAt: new Date(),
} as unknown as Order

describe('OrdersProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.createOrderFromCart.mockResolvedValue('order-test-1')
        mocks.getOrderById.mockResolvedValue(orderFixture)
        mocks.getOrdersByUser.mockResolvedValue([])
        mocks.listOrdersAdmin.mockResolvedValue([])
        mocks.updateOrderStatusAdmin.mockResolvedValue(undefined)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('crea una orden y actualiza el estado', async () => {
        const { result } = renderHook(() => useOrders(), { wrapper })

        let orderId: string | undefined

        await act(async () => {
            orderId = await result.current.createOrder({
                userId: 'customer-test-1',
                items: [],
            })
        })

        expect(orderId).toBe('order-test-1')
        expect(result.current.currentOrder).toEqual(orderFixture)
        expect(result.current.userOrders).toContainEqual(orderFixture)
        expect(result.current.error).toBeNull()
        expect(result.current.isSubmitting).toBe(false)
    })

    it('guarda el error y restablece el estado si falla la creación', async () => {
        mocks.createOrderFromCart.mockRejectedValue(
            new Error('Stock insuficiente'),
        )

        const { result } = renderHook(() => useOrders(), { wrapper })

        await act(async () => {
            await expect(
                result.current.createOrder({
                    userId: 'customer-test-1',
                    items: [],
                }),
            ).rejects.toThrow('Stock insuficiente')
        })

        expect(result.current.error).toBe('Stock insuficiente')
        expect(result.current.isSubmitting).toBe(false)
        expect(result.current.currentOrder).toBeNull()
    })

    it('informa un error si no puede recuperar la orden creada', async () => {
        mocks.getOrderById.mockResolvedValue(null)

        const { result } = renderHook(() => useOrders(), { wrapper })

        await act(async () => {
            await expect(
                result.current.createOrder({
                    userId: 'customer-test-1',
                    items: [],
                }),
            ).rejects.toThrow(
                'La orden se creó, pero no pudimos recuperar sus datos.',
            )
        })

        expect(result.current.error).toBe(
            'La orden se creó, pero no pudimos recuperar sus datos.',
        )
        expect(result.current.isSubmitting).toBe(false)
    })

    it('carga las órdenes del usuario', async () => {
        mocks.getOrdersByUser.mockResolvedValue([orderFixture])

        const { result } = renderHook(() => useOrders(), { wrapper })

        await act(async () => {
            await result.current.loadUserOrders('customer-test-1')
        })

        await waitFor(() => {
            expect(result.current.userOrders).toEqual([orderFixture])
        })

        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBeNull()
    })

    it('limpia las órdenes y los errores', () => {
        const { result } = renderHook(() => useOrders(), { wrapper })

        act(() => {
            result.current.clearOrders()
            result.current.clearCurrentOrder()
            result.current.clearError()
        })

        expect(result.current.userOrders).toEqual([])
        expect(result.current.adminOrders).toEqual([])
        expect(result.current.currentOrder).toBeNull()
        expect(result.current.error).toBeNull()
    })

    it('carga las órdenes de administración filtradas por estado', async () => {
        mocks.listOrdersAdmin.mockResolvedValue([orderFixture])

        const { result } = renderHook(() => useOrders(), { wrapper })

        await act(async () => {
            await result.current.loadAdminOrders({ status: 'pending' })
        })

        expect(mocks.listOrdersAdmin).toHaveBeenCalledWith({
            status: 'pending',
        })
        expect(result.current.adminOrders).toEqual([orderFixture])
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBeNull()
    })

    it('actualiza el estado de una orden en todas las listas', async () => {
        const completedOrder = {
            ...orderFixture,
            status: 'completed',
        } as Order

        mocks.getOrdersByUser.mockResolvedValue([orderFixture])
        mocks.listOrdersAdmin.mockResolvedValue([orderFixture])
        mocks.getOrderById.mockResolvedValue(orderFixture)

        const { result } = renderHook(() => useOrders(), { wrapper })

        await act(async () => {
            await result.current.loadUserOrders('customer-test-1')
            await result.current.loadAdminOrders()
            await result.current.loadOrder(orderFixture.id)
        })

        await act(async () => {
            await result.current.updateOrderStatus(
                orderFixture.id,
                'completed',
            )
        })

        expect(mocks.updateOrderStatusAdmin).toHaveBeenCalledWith(
            orderFixture.id,
            'completed',
        )
        expect(result.current.userOrders).toEqual([completedOrder])
        expect(result.current.adminOrders).toEqual([completedOrder])
        expect(result.current.currentOrder).toEqual(completedOrder)
        expect(result.current.isSubmitting).toBe(false)
        expect(result.current.error).toBeNull()
    })
})

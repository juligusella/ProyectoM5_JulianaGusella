import type { ReactNode } from 'react'
import type {
    Order,
    OrderStatus,
} from '../../types/order'
import type { CartItem } from '../../types/cart'

export type CreateOrderParams = {
    userId: string
    items: CartItem[]
}

export type LoadAdminOrdersParams = {
    status?: OrderStatus
}

export type OrdersContextType = {

    userOrders: Order[]
    adminOrders: Order[]
    currentOrder: Order | null

    isLoading: boolean
    isSubmitting: boolean
    error: string | null

    loadUserOrders: (userId: string) => Promise<void>
    loadAdminOrders: (params?: LoadAdminOrdersParams) => Promise<void>
    loadOrder: (orderId: string) => Promise<void>
    createOrder: (
        params: CreateOrderParams,
    ) => Promise<string | undefined>
    updateOrderStatus: (
        orderId: string,
        status: OrderStatus,
    ) => Promise<void>
    clearCurrentOrder: () => void
    clearOrders: () => void
    clearError: () => void
}

export type OrdersProviderProps = {
    children: ReactNode
}

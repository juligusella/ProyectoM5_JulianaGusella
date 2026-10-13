import type { ReactNode } from 'react'
import type {
    Order,
    OrderStatus,
} from '../../types/order'
import type { CartItem } from '../../types/cart'

// Datos necesarios para crear una orden desde el carrito.
export type CreateOrderParams = {
    userId: string
    items: CartItem[]
}

// Parámetros para cargar las órdenes del administrador.
export type LoadAdminOrdersParams = {
    status?: OrderStatus
}

export type OrdersContextType = {
    // Órdenes
    userOrders: Order[]
    adminOrders: Order[]
    currentOrder: Order | null

    // Estados
    isLoading: boolean
    isSubmitting: boolean
    error: string | null

    // Acciones
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

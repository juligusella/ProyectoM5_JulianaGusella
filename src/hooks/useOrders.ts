import { useContext } from 'react'
import { OrdersContext } from '../contexts/orders/OrdersContext'

export function useOrders() {
    const context = useContext(OrdersContext)

    if (!context) {
        throw new Error(
            'useOrders debe utilizarse dentro de OrdersProvider.',
        )
    }

    return context
}

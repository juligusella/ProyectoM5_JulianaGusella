import { createContext } from 'react'
import type { OrdersContextType } from './OrdersContext.types'

export const OrdersContext = createContext<OrdersContextType | null>(null)

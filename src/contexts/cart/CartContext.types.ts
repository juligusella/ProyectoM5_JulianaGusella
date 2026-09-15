import type { Product } from '../../types/product'
import type { CartItem } from '../../types/cart'

export interface CartContextType {
  items: CartItem[]
  total: number
  totalItems: number

  addItem: (product: Product) => void
  removeItem: (id: string) => void
  incrementQuantity: (id: string) => void
  decrementQuantity: (id: string) => void
  clearCart: () => void
}
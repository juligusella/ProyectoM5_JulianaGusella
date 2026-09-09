export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'

export interface OrderItem {
  productId: string
  name: string
  priceAtPurchase: number
  quantity: number
  imageUrl: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: Date
}
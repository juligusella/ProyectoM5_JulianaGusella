import type { Product } from '../../types/product'

export interface ProductsContextType {
  products: Product[]
  loading: boolean
  error: string | null
}
import { createContext } from 'react'
import type { ProductsContextType } from './ProductsContext.types'

export const ProductsContext =
  createContext<ProductsContextType | null>(null)
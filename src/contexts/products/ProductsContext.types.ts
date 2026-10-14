import type { DocumentSnapshot } from 'firebase/firestore'
import type { CategoryId, Product } from '../../types/product'

export interface CategoryProductsState {
  products: Product[]
  cursor: DocumentSnapshot | null
  hasNextPage: boolean
}

export type ProductsState = {
  productsByCategory: Record<CategoryId, CategoryProductsState>

  isLoading: boolean
  error: string | null

  loadingMoreCategory: CategoryId | null

  searchText: string
  categoryId: CategoryId | null
}

export type ProductsContextType = ProductsState & {
  setSearchText: (value: string) => void
  setCategoryId: (value: CategoryId | null) => void
  loadProducts: (
    options?: {
      reset?: boolean
      categoryId?: CategoryId
    },
  ) => Promise<void>
  resetFilters: () => void
}
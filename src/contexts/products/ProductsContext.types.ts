import type { DocumentSnapshot } from 'firebase/firestore'
import type { CategoryId, Product } from '../../types/product'

export type ProductsState = {
  products: Product[]

  // Estados de la consulta
  isLoading: boolean
  error: string | null

  // Paginación
  cursor: DocumentSnapshot | null
  hasNextPage: boolean
  isLoadingMore: boolean

  // Filtros
  searchText: string
  categoryId: CategoryId | null
}

export type ProductsContextType = ProductsState & {
  setSearchText: (value: string) => void
  setCategoryId: (value: CategoryId | null) => void
  loadProducts: (options?: { reset?: boolean }) => Promise<void>
  resetFilters: () => void
}
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { listProducts } from '../../services/firebase/productService'
import { ProductsContext } from './ProductsContext'
import type {
  ProductsContextType,
  ProductsState,
} from './ProductsContext.types'
import { useDebounce } from '../../hooks/useDebounce'

const PAGE_SIZE = 8

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
  cursor: null,
  hasNextPage: false,
  isLoadingMore: false,
  searchText: '',
  categoryId: null,
}

interface ProductsProviderProps {
  children: ReactNode
}

const ProductsProvider = ({ children }: ProductsProviderProps) => {
  const [state, setState] = useState<ProductsState>(initialState)

  const debouncedSearch = useDebounce(state.searchText, 400)

  const loadProducts = useCallback(
    async ({ reset = false }: { reset?: boolean } = {}) => {
      if (state.isLoading || state.isLoadingMore) {
        return
      }

      const isFirstPage = reset || state.cursor === null

      setState((currentState) => ({
        ...currentState,
        ...(isFirstPage
          ? {
              products: [],
              isLoading: true,
            }
          : {
              isLoadingMore: true,
            }),
        error: null,
      }))

      try {
        const { items, lastDoc } = await listProducts({
          category: state.categoryId ?? undefined,
          searchPrefix:
            debouncedSearch.trim().length >= 2
            ? debouncedSearch.trim().toLowerCase()
            : undefined,
          pageSize: PAGE_SIZE,
          cursor: isFirstPage ? null : state.cursor,
        })

        setState((currentState) => ({
          ...currentState,
          products: isFirstPage
            ? items
            : [...currentState.products, ...items],
          cursor: lastDoc,
          hasNextPage: items.length === PAGE_SIZE,
          isLoading: false,
          isLoadingMore: false,
        }))
      } catch {
        setState((currentState) => ({
          ...currentState,
          isLoading: false,
          isLoadingMore: false,
          error: 'No se pudieron cargar los productos.',
        }))
      }
    },
    [
      state.categoryId,
      debouncedSearch,
      state.cursor,
      state.isLoading,
      state.isLoadingMore,
    ],
  )

  useEffect(() => {
    loadProducts({ reset: true })
  }, [debouncedSearch, state.categoryId])

  const setSearchText = useCallback((value: string) => {
    setState((currentState) => ({
      ...currentState,
      searchText: value,
    }))
  }, [])

  const setCategoryId = useCallback((value: ProductsState['categoryId']) => {
    setState((currentState) => ({
      ...currentState,
      categoryId: value,
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      searchText: '',
      categoryId: null,
      cursor: null,
      hasNextPage: true,
    }))
  }, [])

  const value = useMemo<ProductsContextType>(
    () => ({
      ...state,
      loadProducts,
      setSearchText,
      setCategoryId,
      resetFilters,
    }),
    [
      state,
      loadProducts,
      setSearchText,
      setCategoryId,
      resetFilters,
    ],
  )

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

export default ProductsProvider
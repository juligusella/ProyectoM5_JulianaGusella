import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { listProducts } from '../../services/products/productService'
import { ProductsContext } from './ProductsContext'
import type {
  CategoryProductsState,
  ProductsContextType,
  ProductsState,
} from './ProductsContext.types'
import { useDebounce } from '../../hooks/useDebounce'
import type { CategoryId } from '../../types/product'

const INITIAL_PAGE_SIZE = 4
const LOAD_MORE_PAGE_SIZE = 2

const categoryIds: CategoryId[] = [
  'plantas',
  'macetas',
  'cultivo',
  'terrarios',
]

const createInitialCategoryState = (): CategoryProductsState => ({
  products: [],
  cursor: null,
  hasNextPage: false,
})

const initialProductsByCategory = (): ProductsState['productsByCategory'] => {
  return Object.fromEntries(
    categoryIds.map((categoryId) => [
      categoryId,
      createInitialCategoryState(),
    ]),
  ) as ProductsState['productsByCategory']
}

const initialState: ProductsState = {
  productsByCategory: initialProductsByCategory(),

  isLoading: false,
  error: null,
  loadingMoreCategory: null,
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
    async ({
      reset = false,
      categoryId: requestedCategoryId,
    }: {
      reset?: boolean
      categoryId?: CategoryId
    } = {}) => {
      const targetCategory = requestedCategoryId ?? state.categoryId
      const isAllCategories = targetCategory === null

      if (state.isLoading || state.loadingMoreCategory !== null) {
        return
      }

      const isFirstPage = reset

      setState((currentState) => ({
        ...currentState,
        ...(isFirstPage
          ? {
            productsByCategory: initialProductsByCategory(),
            isLoading: true,
          }
          : {
            loadingMoreCategory: targetCategory,
          }),
        error: null,
      }))

      try {
        const categoriesToLoad = isAllCategories
          ? categoryIds
          : [targetCategory]

        const results = await Promise.all(
          categoriesToLoad.map(async (category) => {
            const currentCategoryState =
              state.productsByCategory[category]

            const { items, lastDoc } = await listProducts({
              category,
              searchPrefix:
                debouncedSearch.trim().length >= 2
                  ? debouncedSearch.trim().toLowerCase()
                  : undefined,
              pageSize: isFirstPage
                ? INITIAL_PAGE_SIZE
                : LOAD_MORE_PAGE_SIZE,
              cursor: isFirstPage
                ? null
                : currentCategoryState.cursor,
            })

            return {
              category,
              items,
              lastDoc,
            }
          }),
        )

        setState((currentState) => {
          const updatedProductsByCategory = {
            ...currentState.productsByCategory,
          }

          results.forEach(({ category, items, lastDoc }) => {
            const currentCategoryState =
              currentState.productsByCategory[category]

            updatedProductsByCategory[category] = {
              products: isFirstPage
                ? items
                : [...currentCategoryState.products, ...items],
              cursor: lastDoc,
              hasNextPage: items.length === (
                isFirstPage
                  ? INITIAL_PAGE_SIZE
                  : LOAD_MORE_PAGE_SIZE
              ),
            }
          })

          return {
            ...currentState,
            productsByCategory: updatedProductsByCategory,
            isLoading: false,
            loadingMoreCategory: null,
          }
        })
      } catch {
        setState((currentState) => ({
          ...currentState,
          isLoading: false,
          loadingMoreCategory: null,
          error: 'No se pudieron cargar los productos.',
        }))
      }
    },
    [
      state.categoryId,
      state.isLoading,
      state.loadingMoreCategory,
      state.productsByCategory,
      debouncedSearch,
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
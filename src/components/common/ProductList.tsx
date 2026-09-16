import { useProducts } from '../../hooks/useProducts'
import EmptyState from '../states/EmptyState'
import ErrorState from '../states/ErrorState'
import LoadingState from '../states/LoadingState'
import ProductCard from './ProductCard'
import type { CategoryId } from '../../types/product'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { ChevronDown } from 'lucide-react'

const categories: { id: CategoryId; label: string }[] = [
  { id: 'plantas', label: 'Plantas' },
  { id: 'macetas', label: 'Macetas' },
  { id: 'cultivo', label: 'Cultivo' },
  { id: 'terrarios', label: 'Terrarios' },
]

const ProductList = () => {
  const {
    productsByCategory,
    isLoading,
    error,
    loadingMoreCategory,
    searchText,
    categoryId,
    setSearchText,
    setCategoryId,
    loadProducts,
    resetFilters,
  } = useProducts()

  const hasFilters =
    searchText.trim().length > 0 || categoryId !== null

  const visibleCategories = categoryId
    ? categories.filter((category) => category.id === categoryId)
    : categories

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 pb-8">

      <div className="mb-8 flex flex-col gap-2 md:flex-row">
        <Input
          aria-label="Buscar productos"
          placeholder="Buscar productos"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />

        <div className="relative w-full">
          <select
            aria-label="Categorías"
            value={categoryId ?? ''}
            onChange={(event) =>
              setCategoryId(
                event.target.value === ''
                  ? null
                  : (event.target.value as CategoryId),
              )
            }
            className="w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 pr-9 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
          >
            <option value="">CATEGORÍAS</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />
        </div>

        <Button
          variant="ghost"
          onClick={resetFilters}
          disabled={!hasFilters}
          className="self-end"
        >
          Limpiar filtros
        </Button>
      </div>

      <div className="flex flex-col gap-12">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : visibleCategories.every(
          (category) =>
            productsByCategory[category.id].products.length === 0,
        ) ? (
          <EmptyState message="No hay productos disponibles." />
        ) : (
          visibleCategories.map((category) => {
            const categoryState = productsByCategory[category.id]
            const categoryProducts = categoryState.products

            if (categoryProducts.length === 0) {
              return null
            }

            return (
              <section key={category.id}>
                <h2 className="mb-6 text-2xl font-semibold uppercase text-[var(--foreground)]">
                  {category.label}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    variant="primary"
                    onClick={() =>
                      loadProducts({
                        reset: false,
                        categoryId: category.id,
                      })
                    }
                    disabled={
                      loadingMoreCategory === category.id ||
                      !categoryState.hasNextPage
                    }
                  >
                    {loadingMoreCategory === category.id
                      ? 'Cargando...'
                      : categoryState.hasNextPage
                        ? 'Cargar más productos'
                        : 'No hay más productos'}
                  </Button>
                </div>
              </section>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ProductList
import { useProducts } from '../../contexts/products/useProducts'
import EmptyState from '../states/EmptyState'
import ErrorState from '../states/ErrorState'
import LoadingState from '../states/LoadingState'
import ProductCard from './ProductCard'
import type { CategoryId } from '../../types/product'
import Input from '../ui/Input'
import Button from '../ui/Button'

const categories: { id: CategoryId; label: string }[] = [
  { id: 'plantas', label: 'Plantas' },
  { id: 'macetas', label: 'Macetas & Decoración' },
  { id: 'cultivo', label: 'Cultivo' },
  { id: 'terrarios', label: 'Terrarios' },
]

const ProductList = () => {
  const {
  products,
  isLoading,
  error,
  hasNextPage,
  isLoadingMore,
  searchText,
  categoryId,
  setSearchText,
  setCategoryId,
  loadProducts,
  resetFilters,
} = useProducts()

const hasFilters =
  searchText.trim().length > 0 || categoryId !== null

return (
  <main className="mx-auto max-w-7xl px-4 py-8">

    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      <Input
        aria-label="Buscar productos"
        placeholder="Buscar productos"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />

      <select
        aria-label="Categoría"
        value={categoryId ?? ''}
        onChange={(event) =>
          setCategoryId(
            event.target.value === ''
              ? null
              : (event.target.value as CategoryId),
          )
        }
      >
        <option value="">Todas las categorías</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>

      <Button
        variant="ghost"
        onClick={resetFilters}
        disabled={!hasFilters}
      >
        Limpiar filtros
      </Button>
    </div>
    
    <div className="flex flex-col gap-12">
     {isLoading && products.length === 0 ? (
        <LoadingState />
     ) : error ? (
        <ErrorState message={error} />
     ) : products.length === 0 ? (
        <EmptyState message="No hay productos disponibles." />
     ) : (
       categories.map((category) => {
        const categoryProducts = products.filter(
          (product) => product.category === category.id,
        )

        if (categoryProducts.length === 0) {
          return null
        }

        return (
          <section key={category.id}>
            <h2 className="mb-6 text-2xl font-semibold uppercase text-[var(--foreground)]">
              {category.label}
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )
       })
      )}
    </div>

    <div className="my-4 flex justify-center">
      <Button
        variant="primary"
        onClick={() => loadProducts()}
        disabled={isLoading || isLoadingMore || !hasNextPage}
      >
        {isLoadingMore
          ? 'Cargando...'
          : hasNextPage
            ? 'Cargar más productos'
            : 'No hay más productos'}
      </Button>
    </div>
  </main>
)
}

export default ProductList
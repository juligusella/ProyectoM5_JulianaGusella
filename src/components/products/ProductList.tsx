import { useProducts } from '../../contexts/products/useProducts'
import ProductCard from './ProductCard'

const categories = [
  'Plantas',
  'Macetas & Decoración',
  'Cultivo',
  'Terrarios',
]

const ProductList = () => {
  const { products, loading, error } = useProducts()

  if (loading) {
    return <p>Cargando productos...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (products.length === 0) {
    return <p>No hay productos disponibles.</p>
  }

return (
  <main className="mx-auto max-w-7xl px-4 py-8">
    <div className="flex flex-col gap-12">
      {categories.map((category) => {
        const categoryProducts = products.filter(
          (product) => product.category === category,
        )

        if (categoryProducts.length === 0) {
          return null
        }

        return (
          <section key={category}>
            <h2 className="mb-6 text-2xl font-semibold uppercase text-[var(--foreground)]">
              {category}
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  </main>
)
}

export default ProductList
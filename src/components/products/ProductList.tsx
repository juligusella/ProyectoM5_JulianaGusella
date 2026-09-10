import { useProducts } from '../../contexts/products/useProducts'
import ProductCard from './ProductCard'

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
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))} 
    </div>
  )
}

export default ProductList
import { useProducts } from '../../contexts/products/useProducts'

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
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}

export default ProductList
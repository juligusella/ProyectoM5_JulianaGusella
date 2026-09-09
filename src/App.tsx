import { useEffect, useState } from 'react'
import { getProducts } from './services/firebase/productService'
import type { Product } from './types/product'

function App() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts()
      setProducts(data)
    }

    loadProducts()
  }, [])

  return (
    <div>
      <h1>AI Driven E-Commerce</h1>

      <h2>Productos</h2>

      {products.map((product) => (
        <p key={product.id}>{product.name}</p>
      ))}
    </div>
  )
}

export default App
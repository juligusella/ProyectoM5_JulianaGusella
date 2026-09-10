import { useEffect, useState } from 'react'
import { ProductsContext } from './ProductsContext'
import { getProducts } from '../../services/firebase/productService'
import type { Product } from '../../types/product'

interface ProductsProviderProps {
  children: React.ReactNode
}

const ProductsProvider = ({ children }: ProductsProviderProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch {
        setError('No se pudieron cargar los productos.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  )
}

export default ProductsProvider
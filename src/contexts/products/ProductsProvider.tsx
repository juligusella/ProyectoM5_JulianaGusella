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

    useEffect(() => {
        const loadProducts = async () => {
            const data = await getProducts()
            setProducts(data)
            setLoading(false)
        }

        loadProducts()
    }, [])

    return (
    <ProductsContext.Provider value={{ products, loading }}>
      {children}
    </ProductsContext.Provider>
  )
}

export default ProductsProvider
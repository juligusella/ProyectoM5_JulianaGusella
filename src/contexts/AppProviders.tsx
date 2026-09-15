import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import ProductsProvider from './products/ProductsProvider'
import { CartProvider } from './cart/CartProvider'
import { FavoritesProvider } from './favorites/FavoritesProvider'

interface AppProvidersProps {
  children: ReactNode
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <BrowserRouter>
      <ProductsProvider>
        <CartProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  )
}

export default AppProviders
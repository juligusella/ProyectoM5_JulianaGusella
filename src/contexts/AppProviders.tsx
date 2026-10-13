import type { ReactNode } from 'react'
import ProductsProvider from './products/ProductsProvider'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './cart/CartProvider'
import { FavoritesProvider } from './favorites/FavoritesProvider'
import { AuthProvider } from './auth/AuthProvider'
import { OrdersProvider } from './orders/OrdersProvider'

interface AppProvidersProps {
  children: ReactNode
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (

    <BrowserRouter>
      <AuthProvider>
        <ProductsProvider>
          <FavoritesProvider>
            <CartProvider>
              <OrdersProvider>
                {children}
              </OrdersProvider>
            </CartProvider>
          </FavoritesProvider>
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppProviders
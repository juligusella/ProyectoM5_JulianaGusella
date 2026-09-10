import type { ReactNode } from 'react'
import ProductsProvider from './products/ProductsProvider'

interface AppProvidersProps {
  children: ReactNode
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ProductsProvider>
      {children}
    </ProductsProvider>
  )
}

export default AppProviders

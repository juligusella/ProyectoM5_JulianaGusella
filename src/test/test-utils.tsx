
import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/auth/AuthProvider'
import ProductsProvider from '../contexts/products/ProductsProvider'
import { FavoritesProvider } from '../contexts/favorites/FavoritesProvider'
import { CartProvider } from '../contexts/cart/CartProvider'
import { OrdersProvider } from '../contexts/orders/OrdersProvider'

interface TestProvidersProps {
    children: ReactNode
}

export function TestProviders({ children }: TestProvidersProps) {
    return (
        <MemoryRouter>
            <AuthProvider>
                <ProductsProvider>
                    <FavoritesProvider>
                        <CartProvider>
                            <OrdersProvider>{children}</OrdersProvider>
                        </CartProvider>
                    </FavoritesProvider>
                </ProductsProvider>
            </AuthProvider>
        </MemoryRouter>
    )
}

export function renderWithProviders(ui: ReactNode) {
    return render(ui, {
        wrapper: TestProviders,
    })
}

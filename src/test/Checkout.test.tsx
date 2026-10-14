
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Checkout from '../pages/checkout/Checkout'
import { productFixture } from './fixtures'

const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
    clearCart: vi.fn(),
    createOrder: vi.fn(),
    clearError: vi.fn(),
    loadProducts: vi.fn(),
    user: { uid: 'customer-test-1' } as { uid: string } | null,
    loading: false,
    isSubmitting: false,
}))

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>()
    return {
        ...actual,
        useNavigate: () => mocks.navigate,
    }
})

vi.mock('../hooks/useCart', () => ({
    useCart: () => ({
        items: [
            {
                productId: productFixture.id,
                name: productFixture.name,
                price: productFixture.price,
                imageUrl: productFixture.imageUrl,
                quantity: 2,
            },
        ],
        total: productFixture.price * 2,
        totalItems: 2,
        clearCart: mocks.clearCart,
    }),
}))

vi.mock('../hooks/useAuth', () => ({
    useAuth: () => ({
        user: mocks.user,
        loading: mocks.loading,
    }),
}))

vi.mock('../hooks/useOrders', () => ({
    useOrders: () => ({
        createOrder: mocks.createOrder,
        isSubmitting: mocks.isSubmitting,
        clearError: mocks.clearError,
    }),
}))

vi.mock('../hooks/useProducts', () => ({
    useProducts: () => ({
        loadProducts: mocks.loadProducts,
    }),
}))

function renderCheckout() {
    return render(
        <MemoryRouter>
            <Checkout />
        </MemoryRouter>,
    )
}

describe('Checkout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.user = { uid: 'customer-test-1' }
        mocks.loading = false
        mocks.isSubmitting = false
        mocks.createOrder.mockResolvedValue('order-test-1')
        mocks.loadProducts.mockResolvedValue(undefined)
    })

    it('muestra el resumen del pedido y el total', () => {
        renderCheckout()

        expect(screen.getByText('Finalizar compra')).toBeInTheDocument()
        expect(screen.getByText(productFixture.name)).toBeInTheDocument()
        expect(screen.getByText('Cantidad: 2')).toBeInTheDocument()
        expect(screen.getByText('2 productos')).toBeInTheDocument()
    })

    it('crea la orden, vacía el carrito y navega al éxito', async () => {
        renderCheckout()

        fireEvent.click(
            screen.getByRole('button', { name: /confirmar compra/i }),
        )

        await waitFor(() => {
            expect(mocks.createOrder).toHaveBeenCalledWith({
                userId: 'customer-test-1',
                items: [
                    {
                        productId: productFixture.id,
                        name: productFixture.name,
                        price: productFixture.price,
                        imageUrl: productFixture.imageUrl,
                        quantity: 2,
                    },
                ],
            })
            expect(mocks.clearCart).toHaveBeenCalledOnce()
            expect(mocks.navigate).toHaveBeenCalledWith(
                '/checkout/success/order-test-1',
            )
        })
    })

    it('conserva el carrito si no se crea la orden', async () => {
        mocks.createOrder.mockResolvedValue(undefined)

        renderCheckout()

        fireEvent.click(
            screen.getByRole('button', { name: /confirmar compra/i }),
        )

        await waitFor(() => {
            expect(mocks.createOrder).toHaveBeenCalledOnce()
        })

        expect(mocks.clearCart).not.toHaveBeenCalled()
        expect(mocks.navigate).not.toHaveBeenCalled()
    })

    it('muestra el error y conserva el carrito si falla la compra', async () => {
        mocks.createOrder.mockRejectedValue(new Error('Stock insuficiente'))

        renderCheckout()

        fireEvent.click(
            screen.getByRole('button', { name: /confirmar compra/i }),
        )

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Stock insuficiente',
        )
        expect(mocks.clearCart).not.toHaveBeenCalled()
        expect(mocks.navigate).not.toHaveBeenCalled()
    })

    it('redirige al login si no hay usuario autenticado', async () => {
        mocks.user = null

        renderCheckout()

        fireEvent.click(
            screen.getByRole('button', { name: /confirmar compra/i }),
        )

        await waitFor(() => {
            expect(mocks.navigate).toHaveBeenCalledWith('/login')
        })

        expect(mocks.createOrder).not.toHaveBeenCalled()
        expect(mocks.clearCart).not.toHaveBeenCalled()
    })

    it('continúa si falla la actualización del catálogo después de comprar', async () => {
        mocks.loadProducts.mockRejectedValue(new Error('Error de catálogo'))
        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => { })

        try {
            renderCheckout()

            fireEvent.click(
                screen.getByRole('button', { name: /confirmar compra/i }),
            )

            await waitFor(() => {
                expect(mocks.clearCart).toHaveBeenCalledOnce()
                expect(mocks.navigate).toHaveBeenCalledWith(
                    '/checkout/success/order-test-1',
                )
            })
        } finally {
            consoleSpy.mockRestore()
        }
    })

    it('no crea una orden mientras se verifica el usuario', () => {
        mocks.loading = true

        renderCheckout()

        expect(
            screen.getByRole('button', { name: /verificando usuario/i }),
        ).toBeDisabled()
        expect(mocks.createOrder).not.toHaveBeenCalled()
    })

    it('deshabilita la confirmación mientras se procesa otra compra', () => {
        mocks.isSubmitting = true

        renderCheckout()

        expect(
            screen.getByRole('button', { name: /procesando compra/i }),
        ).toBeDisabled()
        expect(mocks.createOrder).not.toHaveBeenCalled()
    })
})

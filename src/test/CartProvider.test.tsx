
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import { useContext } from 'react'
import { CartProvider } from '../contexts/cart/CartProvider'
import { CartContext } from '../contexts/cart/CartContext'
import { productFixture } from './fixtures'

const mocks = vi.hoisted(() => ({
    user: { uid: 'customer-test-1' } as { uid: string } | null,
    loading: false,
}))

vi.mock('../hooks/useAuth', () => ({
    useAuth: () => ({
        user: mocks.user,
        loading: mocks.loading,
    }),
}))

function CartConsumer() {
    const cart = useContext(CartContext)

    if (!cart) throw new Error('Falta CartProvider')

    return (
        <div>
            <span data-testid="total-items">{cart.totalItems}</span>
            <span data-testid="total">{cart.total}</span>
            <button onClick={() => cart.addItem(productFixture)}>Agregar</button>
            <button onClick={() => cart.incrementQuantity(productFixture.id)}>
                Incrementar
            </button>
            <button onClick={() => cart.decrementQuantity(productFixture.id)}>
                Decrementar
            </button>
            <button onClick={() => cart.removeItem(productFixture.id)}>Eliminar</button>
            <button onClick={cart.clearCart}>Vaciar</button>
        </div>
    )
}

function renderCart() {
    return render(
        <CartProvider>
            <CartConsumer />
        </CartProvider>,
    )
}

describe('CartProvider', () => {
    beforeEach(() => {
        localStorage.clear()
        mocks.user = { uid: 'customer-test-1' }
        mocks.loading = false
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('comienza con el carrito vacío', async () => {
        renderCart()

        await waitFor(() => {
            expect(screen.getByTestId('total-items').textContent).toBe('0')
            expect(screen.getByTestId('total').textContent).toBe('0')
        })
    })

    it('agrega un producto y calcula los totales', async () => {
        renderCart()

        await waitFor(() => {
            expect(localStorage.getItem('savia-cart-customer-test-1')).not.toBeNull()
        })

        act(() => {
            screen.getByRole('button', { name: 'Agregar' }).click()
        })

        expect(screen.getByTestId('total-items').textContent).toBe('1')
        expect(screen.getByTestId('total').textContent).toBe(
            String(productFixture.price),
        )
    })

    it('incrementa y decrementa la cantidad', async () => {
        renderCart()

        await waitFor(() => {
            expect(localStorage.getItem('savia-cart-customer-test-1')).not.toBeNull()
        })

        act(() => {
            screen.getByRole('button', { name: 'Agregar' }).click()
        })

        act(() => {
            screen.getByRole('button', { name: 'Incrementar' }).click()
        })

        expect(screen.getByTestId('total-items').textContent).toBe('2')
        expect(screen.getByTestId('total').textContent).toBe(
            String(productFixture.price * 2),
        )

        act(() => {
            screen.getByRole('button', { name: 'Decrementar' }).click()
        })

        expect(screen.getByTestId('total-items').textContent).toBe('1')
    })

    it('elimina productos y permite vaciar el carrito', async () => {
        renderCart()

        await waitFor(() => {
            expect(localStorage.getItem('savia-cart-customer-test-1')).not.toBeNull()
        })

        act(() => {
            screen.getByRole('button', { name: 'Agregar' }).click()
        })

        act(() => {
            screen.getByRole('button', { name: 'Eliminar' }).click()
        })

        expect(screen.getByTestId('total-items').textContent).toBe('0')

        act(() => {
            screen.getByRole('button', { name: 'Agregar' }).click()
        })

        act(() => {
            screen.getByRole('button', { name: 'Vaciar' }).click()
        })

        expect(screen.getByTestId('total-items').textContent).toBe('0')
    })

    it('recupera el carrito guardado del usuario', async () => {
        localStorage.setItem(
            'savia-cart-customer-test-1',
            JSON.stringify({
                items: [
                    {
                        productId: productFixture.id,
                        name: productFixture.name,
                        price: productFixture.price,
                        imageUrl: productFixture.imageUrl,
                        quantity: 2,
                    },
                ],
            }),
        )

        renderCart()

        await waitFor(() => {
            expect(screen.getByTestId('total-items').textContent).toBe('2')
            expect(screen.getByTestId('total').textContent).toBe(
                String(productFixture.price * 2),
            )
        })
    })

    it('no mezcla los carritos de usuarios diferentes', async () => {
        localStorage.setItem(
            'savia-cart-otro-usuario',
            JSON.stringify({
                items: [
                    {
                        productId: productFixture.id,
                        name: productFixture.name,
                        price: productFixture.price,
                        imageUrl: productFixture.imageUrl,
                        quantity: 3,
                    },
                ],
            }),
        )

        renderCart()

        await waitFor(() => {
            expect(screen.getByTestId('total-items').textContent).toBe('0')
        })
    })

    it('vacía el estado al cerrar sesión', async () => {
        const { rerender } = renderCart()

        await waitFor(() => {
            expect(localStorage.getItem('savia-cart-customer-test-1')).not.toBeNull()
        })

        act(() => {
            screen.getByRole('button', { name: 'Agregar' }).click()
        })

        await waitFor(() => {
            expect(screen.getByTestId('total-items').textContent).toBe('1')
        })

        mocks.user = null

        rerender(
            <CartProvider>
                <CartConsumer />
            </CartProvider>,
        )

        await waitFor(() => {
            expect(screen.getByTestId('total-items').textContent).toBe('0')
        })
    })
})

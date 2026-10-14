
import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCart } from '../hooks/useCart'
import { CartProvider } from '../contexts/cart/CartProvider'
import { AuthProvider } from '../contexts/auth/AuthProvider'

describe('useCart', () => {
    it('devuelve el contexto cuando está dentro de CartProvider', () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: ({ children }) => (
                <AuthProvider>
                    <CartProvider>{children}</CartProvider>
                </AuthProvider>
            ),
        })

        expect(result.current.items).toEqual([])
        expect(result.current.total).toBe(0)
        expect(result.current.totalItems).toBe(0)
        expect(typeof result.current.addItem).toBe('function')
        expect(typeof result.current.clearCart).toBe('function')
    })

    it('lanza un error cuando se usa fuera de CartProvider', () => {
        expect(() => renderHook(() => useCart())).toThrow(
            'useCart must be used within a CartProvider',
        )
    })
})

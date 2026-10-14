
import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAuth } from '../hooks/useAuth'
import { AuthProvider } from '../contexts/auth/AuthProvider'

vi.mock('firebase/auth', () => ({
    onAuthStateChanged: vi.fn((_auth, callback) => {
        callback(null)
        return vi.fn()
    }),
}))

vi.mock('../services/firebase/config', () => ({
    auth: {},
}))

vi.mock('../services/auth/auth.service', () => ({
    getUserProfile: vi.fn(),
    signupService: vi.fn(),
    signinService: vi.fn(),
    signoutService: vi.fn(),
    signinWithGoogleService: vi.fn(),
}))

describe('useAuth', () => {
    it('devuelve el contexto cuando está dentro de AuthProvider', async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        })

        await vi.waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.user).toBeNull()
        expect(typeof result.current.signin).toBe('function')
        expect(typeof result.current.signup).toBe('function')
        expect(typeof result.current.signout).toBe('function')
        expect(typeof result.current.signinWithGoogle).toBe('function')
    })

    it('lanza un error cuando se usa fuera de AuthProvider', () => {
        expect(() => renderHook(() => useAuth())).toThrow(
            'useAuth debe ser utilizado dentro de AuthProvider',
        )
    })
})

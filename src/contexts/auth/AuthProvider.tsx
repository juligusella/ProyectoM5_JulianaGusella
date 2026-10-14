import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'

import { AuthContext } from './AuthContext'
import type { User } from '../../types/user'
import {
    getUserProfile,
    signinService,
    signinWithGoogleService,
    signoutService,
    signupService,
} from '../../services/auth/auth.service'
import { auth } from '../../services/firebase/config'

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({
    children,
}: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (firebaseUser) => {

                if (!firebaseUser) {
                    setUser(null)
                    setLoading(false)
                    return
                }

                try {
                    const profile = await getUserProfile(firebaseUser.uid)
                    setUser(profile)
                } catch (error) {
                    console.error('Error al obtener el perfil:', error)
                    setUser(null)
                } finally {
                    setLoading(false)
                }
            },
        )

        return unsubscribe
    }, [])

    const signup = async (
        email: string,
        password: string,
        displayName: string,
    ) => {
        await signupService(email, password, displayName)
    }

    const signin = async (
        email: string,
        password: string,
    ) => {
        await signinService(email, password)
    }

    const signout = async () => {
        await signoutService()
    }

    const signinWithGoogle = async () => {
        await signinWithGoogleService()
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signup,
                signin,
                signout,
                signinWithGoogle,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
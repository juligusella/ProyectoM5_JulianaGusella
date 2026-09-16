import type { User } from '../../types/user'

export interface AuthContextValue {
    user: User | null
    loading: boolean
    signup: (
        email: string,
        password: string,
        displayName: string,
    ) => Promise<void>
    signin: (email: string, password: string) => Promise<void>
    signout: () => Promise<void>
    signinWithGoogle: () => Promise<void>
}
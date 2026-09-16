import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'

const Register = () => {
    const navigate = useNavigate()
    const { signup, signinWithGoogle } = useAuth()

    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            setIsLoading(true)
            setError(null)

            await signup(email, password, displayName)

            navigate('/')
        } catch {
            setError('No pudimos crear la cuenta. Revisá los datos e intentá nuevamente.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true)
            setError(null)

            await signinWithGoogle()

            navigate('/')
        } catch {
            setError('No pudimos iniciar sesión con Google.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="mx-auto max-w-md px-4 py-10">
            <h1 className="font-serif text-3xl text-[var(--foreground)]">
                Crear cuenta
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
                Creá tu cuenta en SAVIA.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <Input
                    type="text"
                    placeholder="Nombre"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    required
                />

                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <Input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                {error && (
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Crear cuenta
                </Button>
            </form>

            <div className="my-6 text-center text-xs text-[var(--muted)]">
                o
            </div>

            <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleGoogleSignIn}
                loading={isLoading}
                disabled={isLoading}
            >
                Continuar con Google
            </Button>

            <p className="mt-8 text-center text-sm text-[var(--muted)]">
                ¿Ya tenés una cuenta?{' '}
                <Link
                    to="/login"
                    className="font-medium text-[var(--foreground)] underline"
                >
                    Iniciar sesión
                </Link>
            </p>
        </main>
    )
}

export default Register
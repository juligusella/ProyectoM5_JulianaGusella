import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const AdminRoute = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return <p>Cargando...</p>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '../common/admin/AdminSidebar'

export const AdminLayout = () => {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <AdminSidebar />

            <main className="min-w-0 flex-1 p-4 md:p-6">
                <Outlet />
            </main>
        </div>
    )
}
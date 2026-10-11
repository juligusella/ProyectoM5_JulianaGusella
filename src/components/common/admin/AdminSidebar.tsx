import { NavLink } from 'react-router-dom'

export const AdminSidebar = () => {
    const linkStyle = ({ isActive }: { isActive: boolean }) =>
        [
            'rounded-sm px-3 py-2 transition-colors',
            isActive
                ? 'bg-[var(--surface)]'
                : 'bg-transparent hover:bg-[var(--surface)]',
        ].join(' ')

    return (
        <aside className="w-full border-b border-[var(--border)] p-4 md:w-55 md:border-b-0 md:border-r">
            <h2 className="font-serif text-lg text-[var(--foreground)]">
                Panel de administración
            </h2>

            <hr className="my-4 border-[var(--border)]" />

            <nav className="mt-4 flex gap-2 md:flex-col">
                <NavLink to="/admin/products" className={linkStyle}>
                    Productos
                </NavLink>

                <NavLink to="/admin/orders" className={linkStyle}>
                    Pedidos
                </NavLink>
            </nav>
        </aside>
    )
}
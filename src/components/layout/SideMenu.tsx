
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, House, Sprout, Leaf } from 'lucide-react'

interface SideMenuProps {
    isOpen: boolean
    onClose: () => void
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
    const navigate = useNavigate()

    useEffect(() => {
        if (!isOpen) return

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handleEscape)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const goTo = (path: string) => {
        onClose()
        navigate(path)
    }

    return (
        <div className="fixed inset-0 z-[100]">
            <button
                type="button"
                aria-label="Cerrar menú"
                onClick={onClose}
                className="absolute inset-0 h-full w-full bg-black/40"
            />

            <aside
                aria-label="Menú principal"
                className="absolute left-0 top-0 flex h-full w-[min(85vw,320px)] flex-col border-r border-[var(--border)] bg-[var(--background)] shadow-xl"
            >
                <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
                    <button
                        type="button"
                        onClick={() => goTo('/')}
                        className="text-left"
                    >
                        <span className="block font-brand text-3xl text-[var(--foreground)]">
                            SAVIA
                        </span>
                        <span className="text-[9px] uppercase tracking-widest text-[var(--muted)]">
                            Espacios vivos
                        </span>
                    </button>

                    <button
                        type="button"
                        aria-label="Cerrar menú"
                        onClick={onClose}
                        className="rounded-md p-2 text-[var(--foreground)] hover:bg-[var(--surface)]"
                    >
                        <X size={21} strokeWidth={1.7} />
                    </button>
                </div>

                <nav className="space-y-1 p-4">
                    <button
                        type="button"
                        onClick={() => goTo('/')}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface)]"
                    >
                        <House size={18} strokeWidth={1.7} />
                        Inicio
                    </button>

                    <div className="my-3 border-t border-[var(--border)]" />

                    <p className="px-3 pb-2 text-xs uppercase tracking-widest text-[var(--muted)]">
                        Explorar
                    </p>

                    <button
                        type="button"
                        onClick={() => goTo('/catalog')}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface)]"
                    >
                        <Leaf size={18} strokeWidth={1.7} />
                        Todos los productos
                    </button>

                    <button
                        type="button"
                        onClick={() => goTo('/catalog/plantas')}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface)]"
                    >
                        <Sprout size={18} strokeWidth={1.7} />
                        Plantas
                    </button>

                    <button
                        type="button"
                        onClick={() => goTo('/catalog/macetas')}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface)]"
                    >
                        <Sprout size={18} strokeWidth={1.7} />
                        Macetas
                    </button>

                    <button
                        type="button"
                        onClick={() => goTo('/catalog/cultivo')}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface)]"
                    >
                        <Sprout size={18} strokeWidth={1.7} />
                        Cultivo
                    </button>

                    <button
                        type="button"
                        onClick={() => goTo('/catalog/terrarios')}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface)]"
                    >
                        <Sprout size={18} strokeWidth={1.7} />
                        Terrarios
                    </button>
                </nav>

                <div className="mt-auto border-t border-[var(--border)] px-5 py-4 text-xs text-[var(--muted)]">
                    SAVIA · Espacios vivos
                </div>
            </aside>
        </div>
    )
}

export default SideMenu

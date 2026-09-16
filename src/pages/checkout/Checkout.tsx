import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '../../components/ui/Button'
import { useCart } from '../../hooks/useCart'

const Checkout = () => {
    const navigate = useNavigate()
    const { items, total, totalItems } = useCart()

    if (items.length === 0) {
        return (
            <main className="px-4 py-8">
                <h1 className="font-serif text-2xl text-[var(--foreground)]">
                    Checkout
                </h1>

                <p className="mt-6 text-sm text-[var(--muted)]">
                    No hay productos para comprar.
                </p>

                <Button
                    variant="primary"
                    className="mt-6"
                    onClick={() => navigate('/catalog')}
                >
                    Seguir comprando
                </Button>
            </main>
        )
    }

    return (
        <main className="px-4 py-8">
            <Button
                variant="ghost"
                onClick={() => navigate('/cart')}
                className="mb-6"
            >
                <ArrowLeft size={16} />
                Volver al carrito
            </Button>

            <h1 className="font-serif text-2xl text-[var(--foreground)]">
                Finalizar compra
            </h1>

            <section className="mt-8">
                <h2 className="font-serif text-lg text-[var(--foreground)]">
                    Resumen del pedido
                </h2>

                <div className="mt-4 space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.productId}
                            className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-3"
                        >
                            <div>
                                <p className="text-sm font-medium uppercase text-[var(--foreground)]">
                                    {item.name}
                                </p>

                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    Cantidad: {item.quantity}
                                </p>
                            </div>

                            <p className="text-sm font-semibold text-[var(--foreground)]">
                                {new Intl.NumberFormat('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                }).format(item.price * item.quantity)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-[var(--muted)]">
                        {totalItems} productos
                    </span>

                    <span className="font-serif text-xl text-[var(--foreground)]">
                        {new Intl.NumberFormat('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                        }).format(total)}
                    </span>
                </div>
            </section>

            <section className="mt-10">
                <h2 className="font-serif text-lg text-[var(--foreground)]">
                    Datos de compra
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    La compra es simulada. En el próximo paso confirmaremos el pedido.
                </p>

                <Button
                    variant="primary"
                    className="mt-6 w-full"
                >
                    Confirmar compra
                </Button>
            </section>
        </main>
    )
}

export default Checkout
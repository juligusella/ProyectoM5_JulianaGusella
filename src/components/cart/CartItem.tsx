import Button from '../ui/Button'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import type { CartItem as CartItemType } from '../../types/cart'

interface CartItemProps {
    item: CartItemType
}

const CartItem = ({ item }: CartItemProps) => {
    const {
        incrementQuantity,
        decrementQuantity,
        removeItem,
    } = useCart()

    return (
        <article className="flex gap-4 border-b border-[var(--border)] py-4">
            <img
                src={item.imageUrl}
                alt={item.name}
                className="h-24 w-24 shrink-0 object-cover"
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="text-sm font-medium uppercase leading-tight text-[var(--foreground)]">
                        {item.name}
                    </h2>

                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Eliminar ${item.name}`}
                        className="h-7 w-7 shrink-0 p-0"
                        onClick={() => removeItem(item.productId)}
                    >
                        <Trash2 size={16} strokeWidth={1.5} />
                    </Button>
                </div>

                <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                    {new Intl.NumberFormat('es-AR', {
                        style: 'currency',
                        currency: 'ARS',
                    }).format(item.price)}
                </p>

                <div className="mt-auto flex items-center gap-3 pt-3">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Disminuir cantidad de ${item.name}`}
                            className="h-7 w-7 p-0"
                            onClick={() => decrementQuantity(item.productId)}
                        >
                            <Minus size={14} strokeWidth={1.5} />
                        </Button>

                        <span className="min-w-5 text-center text-sm">
                            {item.quantity}
                        </span>

                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Aumentar cantidad de ${item.name}`}
                            className="h-7 w-7 p-0"
                            onClick={() => incrementQuantity(item.productId)}
                        >
                            <Plus size={14} strokeWidth={1.5} />
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default CartItem
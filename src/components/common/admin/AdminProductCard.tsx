import type { Product } from '../../../types/product'
import Button from '../../ui/Button'

interface AdminProductCardProps {
    product: Product
    isDeleting: boolean
    onEdit: () => void
    onDelete: () => void
}

export const AdminProductCard = ({
    product,
    isDeleting,
    onEdit,
    onDelete,
}: AdminProductCardProps) => {
    return (
        <article className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-4">
            <img
                src={product.imageUrl}
                alt={product.name}
                className="h-48 w-full rounded-[var(--radius-md)] object-cover"
            />

            <div className="mt-4">
                <h2 className="font-medium text-[var(--foreground)]">
                    {product.name}
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                    ${product.price.toLocaleString('es-AR')}
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                    Stock: {product.stock}
                </p>
            </div>

            <div className="mt-4 flex gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    loading={false}
                    onClick={onEdit}
                >
                    Editar
                </Button>

                <Button
                    variant="danger"
                    size="sm"
                    loading={isDeleting}
                    onClick={onDelete}
                >
                    Eliminar
                </Button>
            </div>
        </article>
    )
}
import { Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useFavorites } from '../../hooks/useFavorites'
import type { Product } from '../../types/product'
import { Link } from 'react-router-dom'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart()
  const { items, addFavorite, removeFavorite } = useFavorites()

  const isFavorite = items.some(
    (item) => item.id === product.id,
  )

  const handleFavorite = () => {
    if (isFavorite) {
      removeFavorite(product.id)
    } else {
      addFavorite(product)
    }
  }

  return (
    <article>
      <Link
        to={`/product/${product.id}`}
        state={{ category: product.category }}
      >
        <img
          className="h-56 w-full object-cover"
          src={product.imageUrl}
          alt={product.name}
        />
      </Link>

      <div className="relative px-2 py-2">
        <Link
          to={`/product/${product.id}`}
          state={{ category: product.category }}
        >
          <h2 className="pr-7 text-xs font-semibold uppercase leading-tight text-[var(--foreground)]">
            {product.name}
          </h2>
        </Link>

        <div className="absolute right-0 top-2 flex flex-col items-center gap-0">
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center"
            aria-label={`Agregar ${product.name} al carrito`}
            disabled={product.stock === 0}
            onClick={() => addItem(product)}
          >
            <ShoppingBag
              size={16}
              strokeWidth={1.5}
            />
          </button>

          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center"
            aria-label={
              isFavorite
                ? `Quitar ${product.name} de favoritos`
                : `Agregar ${product.name} a favoritos`
            }
            aria-pressed={isFavorite}
            onClick={handleFavorite}
          >
            <Heart
              size={16}
              strokeWidth={1.5}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <p className="mt-1 text-xs font-bold text-[var(--foreground)]">
          {new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
          }).format(product.price)}
        </p>

        <p
          className={
            product.stock > 0
              ? 'mt-1 text-[10px] font-medium text-[var(--success)]'
              : 'mt-1 text-[10px] font-medium text-[var(--danger)]'
          }
        >
          {product.stock > 0 ? 'En stock' : 'Sin stock'}
        </p>
      </div>
    </article>
  )
}

export default ProductCard
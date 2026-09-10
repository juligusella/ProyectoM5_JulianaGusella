import type { Product } from '../../types/product'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article>
      <img
        className="h-56 w-full object-cover"
        src={product.imageUrl}
        alt={product.name}
      />

      <div className="flex flex-col p-4">
        <h2 className="text-lg font-semibold uppercase text-[var(--foreground)]">
          {product.name}
        </h2>

        <p className="text-base font-bold text-[var(--foreground)]">
          {new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
          }).format(product.price)}
        </p>

        <p
          className={
            product.stock > 0
              ? 'mt-2 text-sm font-medium text-[var(--success)]'
              : 'mt-2 text-sm font-medium text-[var(--danger)]'
          }
        >
          {product.stock > 0 ? 'En stock' : 'Sin stock'}
        </p>
      </div>
    </article>
  )
}

export default ProductCard
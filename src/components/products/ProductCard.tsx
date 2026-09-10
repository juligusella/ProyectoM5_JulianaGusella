import type { Product } from '../../types/product'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article className="product-card">
      <img
        className="product-card__image"
        src={product.imageUrl}
        alt={product.name}
      />

      <div className="product-card__content">
        <p className="product-card__category">
          {product.category}
        </p>

        <h2 className="product-card__name">
          {product.name}
        </h2>

        <p className="product-card__price">
          {new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
          }).format(product.price)}
        </p>

        <p className="product-card__stock">
          {product.stock > 0 ? 'En stock' : 'Sin stock'}
        </p>
      </div>
    </article>
  )
}

export default ProductCard
import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import Button from '../../components/ui/Button'
import type { Product } from '../../types/product'

interface ProductDetailProps {
  product: Product
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) {
      addItem(product)
    }
  }

  return (
    <main className="px-4 py-6">
      <div className="overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-[420px] w-full object-cover"
        />
      </div>

      <div className="mt-6">
        <h1 className="font-serif text-2xl uppercase text-[var(--foreground)]">
          {product.name}
        </h1>

        <p className="mt-2 text-xl font-bold text-[var(--foreground)]">
          {new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
          }).format(product.price)}
        </p>

        <p
          className={
            product.stock > 0
              ? 'mt-3 text-sm font-medium text-[var(--success)]'
              : 'mt-3 text-sm font-medium text-[var(--danger)]'
          }
        >
          {product.stock > 0
            ? `${product.stock} unidades disponibles`
            : 'Sin stock'}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={decreaseQuantity}
            disabled={quantity === 1}
            aria-label="Disminuir cantidad"
          >
            <Minus size={18} />
          </Button>

          <span className="min-w-6 text-center">{quantity}</span>

          <Button
            variant="ghost"
            size="icon"
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
            aria-label="Aumentar cantidad"
          >
            <Plus size={18} />
          </Button>
        </div>

        <Button
          variant="primary"
          className="mt-6 w-full"
          disabled={product.stock === 0}
          onClick={handleAddToCart}
        >
          Agregar al carrito
        </Button>
      </div>
    </main>
  )
}

export default ProductDetail
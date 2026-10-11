import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import Button from '../../components/ui/Button'
import LoadingState from '../../components/states/LoadingState'
import ErrorState from '../../components/states/ErrorState'
import { getProductById } from '../../services/products/productService'
import type { Product } from '../../types/product'

const ProductDetail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCart()

  const category = location.state?.category

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('Producto no encontrado.')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const result = await getProductById(id)

        if (!result) {
          setError('Producto no encontrado.')
          return
        }

        setProduct(result)
      } catch {
        setError('No pudimos cargar el producto.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  const handleAddToCart = () => {
    if (!product) return

    for (let i = 0; i < quantity; i += 1) {
      addItem(product)
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error || !product) {
    return <ErrorState message={error ?? 'Producto no encontrado.'} />
  }

  return (
    <main className="px-4 py-6">
      <Button
        variant="ghost"
        onClick={() =>
          navigate(category ? `/catalog/${category}` : '/catalog')
        }
        className="mb-4"
      >
        <ArrowLeft size={16} />
        Volver
      </Button>

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

        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
          {product.description}
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

          <span className="min-w-6 text-center">
            {quantity}
          </span>

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
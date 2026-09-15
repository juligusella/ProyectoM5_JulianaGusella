import { useFavorites } from '../../hooks/useFavorites'
import Button from '../ui/Button'
import ProductCard from './ProductCard'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const FavoriteList = () => {
  const { items } = useFavorites()
  const navigate = useNavigate()

  return (
    <section className="px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft size={16} />
        Volver
      </Button>

      <h2 className="mb-6 font-serif text-2xl text-[var(--foreground)]">
        ❤️ Favoritos
      </h2>

      {items.length === 0 ? (
        <p className="text-sm italic text-[var(--muted)]">
          Aún no hay favoritos.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default FavoriteList
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductList from '../components/common/ProductList'
import { useProducts } from '../hooks/useProducts'
import type { CategoryId } from '../types/product'

const validCategories: CategoryId[] = [
  'plantas',
  'macetas',
  'cultivo',
  'terrarios',
]

const Catalog = () => {
  const { category } = useParams<{ category?: string }>()
  const { setCategoryId } = useProducts()

  useEffect(() => {
    const categoryId = validCategories.includes(category as CategoryId)
      ? (category as CategoryId)
      : null

    setCategoryId(categoryId)
  }, [category, setCategoryId])

  return (
    <main>
      <section className="px-4 pt-8 pb-4 text-center">
        <p className="mx-auto max-w-md text-md leading-relaxed text-[var(--muted)]">
          Encontrá plantas y objetos para hacer de tu casa
          <br />
          un espacio vivo.
        </p>
      </section>

      <ProductList />
    </main>
  )
}

export default Catalog
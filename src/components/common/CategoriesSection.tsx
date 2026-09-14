import categoryPlantas from '../../assets/category-plantas.png'
import categoryMacetas from '../../assets/category-macetas.png'
import categoryCultivo from '../../assets/category-cultivo.png'
import categoryTerrarios from '../../assets/category-terrarios.png'
import CategoryCard from './CategoryCard'

const categories = [
  {
    image: categoryPlantas,
    title: 'Plantas',
    description: 'Vida en cada rincón',
  },
  {
    image: categoryMacetas,
    title: 'Macetas & Decoración',
    description: 'Decorá con naturaleza',
  },
  {
    image: categoryCultivo,
    title: 'Cultivo',
    description: 'Todo lo que necesitás para crecer',
  },
  {
    image: categoryTerrarios,
    title: 'Terrarios',
    description: 'Pequeños mundos verdes',
  },
]

const CategoriesSection = () => {
  return (
    <section className="px-4 py-12">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-2xl text-[var(--foreground)]">
          Encontrá tu forma de crear
        </h2>

        <p className="mt-2 text-xs uppercase tracking-widest text-[var(--muted)]">
          Plantas, objetos y herramientas para espacios vivos
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.title}
            image={category.image}
            title={category.title}
          />
        ))}
      </div>
    </section>
  )
}

export default CategoriesSection
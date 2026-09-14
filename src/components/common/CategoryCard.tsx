interface CategoryCardProps {
  image: string
  title: string
}

const CategoryCard = ({
  image,
  title,
}: CategoryCardProps) => {
  return (
    <article className="relative overflow-hidden">
      <img
        src={image}
        alt={title}
        className="h-56 w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-center font-serif text-lg font-bold uppercase tracking-wide text-white">
          {title}
        </h3>
      </div>
</article>
  )
}

export default CategoryCard
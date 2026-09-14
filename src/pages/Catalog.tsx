import ProductList from '../components/common/ProductList'

const Catalog = () => {
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
import heroImage from '../../assets/savia-hero.png'
import Button from '../ui/Button'

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      <img
        src={heroImage}
        alt="Interior de un hogar decorado con plantas"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      <div className="relative flex min-h-[70vh] items-end px-6 pb-8">
        <div className="max-w-md text-white">
          <h1 className="font-serif text-4xl font-normal leading-none">
            Traé vida
            <br />
            a tu casa.
          </h1>

          <p className="mt-1 max-w-xs text-sm leading-relaxed">
            Plantas y objetos para crear
            <br />
            espacios vivos.
          </p>

          <Button
            variant="primary"
            className="mt-5"
          >
            Explorar el catálogo
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero
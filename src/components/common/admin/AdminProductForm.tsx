
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { CategoryId, Product } from '../../../types/product'
import Button from '../../ui/Button'
import {
    createProduct,
    getProductById,
    updateProduct,
} from '../../../services/products/productService'
import { uploadImage } from '../../../services/storage/upload.service'

interface ProductFormFields {
    name: string
    description: string
    price: string
    stock: string
    category: CategoryId | ''
    imageUrl: string
}

const INITIAL_FIELDS: ProductFormFields = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
}

const CATEGORIES: { value: CategoryId; label: string }[] = [
    { value: 'plantas', label: 'Plantas' },
    { value: 'macetas', label: 'Macetas & Decoración' },
    { value: 'cultivo', label: 'Cultivo' },
    { value: 'terrarios', label: 'Terrarios' },
]

export const AdminProductForm = () => {
    const navigate = useNavigate()
    const { id: productId } = useParams<{ id: string }>()
    const isEditing = Boolean(productId)

    const [fields, setFields] =
        useState<ProductFormFields>(INITIAL_FIELDS)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [filePreview, setFilePreview] = useState('')
    const [isLoading, setIsLoading] = useState(Boolean(productId))
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        const loadProduct = async () => {
            if (!productId) {
                setFields(INITIAL_FIELDS)
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                const product: Product | null =
                    await getProductById(productId)

                if (cancelled) return

                if (!product) {
                    setError('No se encontró el producto.')
                    return
                }

                setFields({
                    name: product.name ?? '',
                    description: product.description ?? '',
                    price: String(product.price ?? ''),
                    stock: String(product.stock ?? ''),
                    category: product.category ?? '',
                    imageUrl: product.imageUrl ?? '',
                })
            } catch (err) {
                if (!cancelled) {
                    console.error(err)
                    setError('No se pudo cargar el producto.')
                }
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        void loadProduct()

        return () => {
            cancelled = true
        }
    }, [productId])

    useEffect(() => {
        if (!selectedFile) {
            setFilePreview('')
            return
        }

        const preview = URL.createObjectURL(selectedFile)
        setFilePreview(preview)

        return () => URL.revokeObjectURL(preview)
    }, [selectedFile])

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target

        setFields((previous) => ({
            ...previous,
            [name]: value,
        }))

        setError(null)
    }

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()
        setError(null)

        const name = fields.name.trim()
        const description = fields.description.trim()
        const price = Number(fields.price)
        const stock = Number(fields.stock)

        if (!name || !description || !fields.category) {
            setError('Completá el nombre, la descripción y la categoría.')
            return
        }

        if (
            fields.price.trim() === '' ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            setError('Ingresá un precio válido.')
            return
        }

        if (
            fields.stock.trim() === '' ||
            !Number.isInteger(stock) ||
            stock < 0
        ) {
            setError('El stock debe ser un número entero igual o mayor a cero.')
            return
        }

        if (!selectedFile && !fields.imageUrl && !isEditing) {
            setError('Seleccioná una imagen para el producto.')
            return
        }

        if (
            selectedFile &&
            !['image/jpeg', 'image/png', 'image/webp'].includes(
                selectedFile.type
            )
        ) {
            setError('La imagen debe ser JPG, PNG o WebP.')
            return
        }

        setIsSaving(true)

        try {
            let imageUrl = fields.imageUrl

            if (selectedFile) {
                imageUrl = await uploadImage(selectedFile)
            }

            const productData: Omit<Product, 'id'> = {
                name,
                nameLower: name.toLowerCase(),
                description,
                price,
                category: fields.category,
                imageUrl,
                stock,
            }

            if (productId) {
                await updateProduct(productId, productData)
            } else {
                await createProduct(productData)
            }

            navigate('/admin/products')
        } catch (err) {
            console.error('Error al guardar el producto:', err)

            setError(
                err instanceof Error
                    ? `No se pudo guardar el producto: ${err.message}`
                    : 'No se pudo guardar el producto. Intentá nuevamente.'
            )
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <p className="p-4">Cargando producto...</p>
    }

    return (
        <section>
            <div>
                <h1 className="font-serif text-2xl text-[var(--foreground)]">
                    {isEditing ? 'Editar producto' : 'Nuevo producto'}
                </h1>

                <p className="mt-2 text-sm text-[var(--muted)]">
                    {isEditing
                        ? 'Modificá los datos del producto.'
                        : 'Agregá un nuevo producto al catálogo de SAVIA.'}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-8 max-w-xl space-y-5"
            >
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-[var(--foreground)]"
                    >
                        Nombre
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={fields.name}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-[var(--foreground)]"
                    >
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        required
                        value={fields.description}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium text-[var(--foreground)]"
                    >
                        Precio
                    </label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={fields.price}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label
                        htmlFor="stock"
                        className="block text-sm font-medium text-[var(--foreground)]"
                    >
                        Stock
                    </label>
                    <input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={fields.stock}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label
                        htmlFor="category"
                        className="block text-sm font-medium text-[var(--foreground)]"
                    >
                        Categoría
                    </label>
                    <select
                        id="category"
                        name="category"
                        required
                        value={fields.category}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
                    >
                        <option value="" disabled>
                            Seleccioná una categoría
                        </option>
                        {CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="image"
                        className="block text-sm font-medium text-[var(--foreground)]"
                    >
                        Imagen {isEditing && '(opcional si conservás la actual)'}
                    </label>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => {
                            setSelectedFile(event.target.files?.[0] ?? null)
                            setError(null)
                        }}
                        className="mt-2 block w-full text-sm text-[var(--muted)]"
                    />

                    {(filePreview || fields.imageUrl) && (
                        <img
                            src={filePreview || fields.imageUrl}
                            alt="Vista previa del producto"
                            className="mt-3 h-40 w-full rounded-lg object-cover"
                        />
                    )}
                </div>

                {error && (
                    <p
                        role="alert"
                        className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800"
                    >
                        {error}
                    </p>
                )}

                <div className="flex flex-wrap gap-3">
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        loading={isSaving}
                    >
                        {isSaving
                            ? 'Guardando...'
                            : isEditing
                                ? 'Guardar cambios'
                                : 'Crear producto'}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="md"
                        onClick={() => navigate('/admin/products')}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </section>
    )
}

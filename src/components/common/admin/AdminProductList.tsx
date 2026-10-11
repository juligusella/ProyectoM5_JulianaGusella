import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { DocumentSnapshot } from 'firebase/firestore'

import type { CategoryId, Product } from '../../../types/product'
import {
    deleteProduct,
    listProducts,
} from '../../../services/products/productService'
import Button from '../../ui/Button'
import LoadingState from '../../states/LoadingState'
import ErrorState from '../../states/ErrorState'
import { AdminProductCard } from './AdminProductCard'

const CATEGORIES: {
    id: CategoryId | ''
    label: string
}[] = [
        { id: '', label: 'Todas' },
        { id: 'plantas', label: 'Plantas' },
        { id: 'macetas', label: 'Macetas & Decoración' },
        { id: 'cultivo', label: 'Cultivo' },
        { id: 'terrarios', label: 'Terrarios' },
    ]

const PAGE_SIZE = 4

export const AdminProductList = () => {
    const navigate = useNavigate()

    const [products, setProducts] = useState<Product[]>([])
    const [searchText, setSearchText] = useState('')
    const [category, setCategory] = useState<CategoryId | ''>('')

    const [lastDoc, setLastDoc] =
        useState<DocumentSnapshot | null>(null)

    const [hasNextPage, setHasNextPage] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [deletingId, setDeletingId] =
        useState<string | null>(null)

    const loadProducts = async (
        reset = false,
    ) => {
        try {
            setError(null)

            if (reset) {
                setIsLoading(true)
            } else {
                setIsLoadingMore(true)
            }

            const result = await listProducts({
                category: category || undefined,
                searchPrefix:
                    searchText.trim().length >= 2
                        ? searchText.trim().toLowerCase()
                        : undefined,
                pageSize: PAGE_SIZE,
                cursor: reset ? null : lastDoc,
            })

            if (reset) {
                setProducts(result.items)
            } else {
                setProducts((prev) => [
                    ...prev,
                    ...result.items,
                ])
            }

            setLastDoc(result.lastDoc)
            setHasNextPage(result.hasNextPage)
        } catch (error) {
            console.error(error)
            setError('No se pudieron cargar los productos.')
        } finally {
            setIsLoading(false)
            setIsLoadingMore(false)
        }
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadProducts(true)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchText, category])

    const handleDelete = async (
        productId: string,
        productName: string,
    ) => {
        const confirmed = window.confirm(
            `¿Eliminar el producto "${productName}"?`,
        )

        if (!confirmed) {
            return
        }

        try {
            setDeletingId(productId)

            await deleteProduct(productId)

            await loadProducts(true)
        } catch (error) {
            console.error(error)
            setError('No se pudo eliminar el producto.')
        } finally {
            setDeletingId(null)
        }
    }

    const handleLoadMore = () => {
        if (!hasNextPage || isLoadingMore) {
            return
        }

        loadProducts()
    }

    const handleResetFilters = () => {
        setSearchText('')
        setCategory('')
    }

    const hasFilters =
        searchText.trim().length > 0 || category !== ''

    return (
        <section>
            {/* HEADER */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="font-serif text-2xl text-[var(--foreground)]">
                        Productos
                    </h1>

                    <p className="mt-2 text-sm text-[var(--muted)]">
                        Administrá el catálogo de SAVIA.
                    </p>
                </div>

                <Button
                    variant="primary"
                    size="md"
                    loading={false}
                    onClick={() => navigate('/admin/products/new')}
                >
                    Crear producto
                </Button>
            </div>

            {/* FILTROS */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
                <input
                    aria-label="Buscar productos"
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchText}
                    onChange={(event) =>
                        setSearchText(event.target.value)
                    }
                    className="w-full max-w-sm rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] outline-none"
                />

                <select
                    aria-label="Filtrar por categoría"
                    value={category}
                    onChange={(event) =>
                        setCategory(
                            event.target.value as CategoryId | '',
                        )
                    }
                    className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]"
                >
                    {CATEGORIES.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.label}
                        </option>
                    ))}
                </select>

                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        loading={false}
                        onClick={handleResetFilters}
                    >
                        Limpiar filtros
                    </Button>
                )}
            </div>

            {/* LOADING */}
            {isLoading && (
                <LoadingState />
            )}

            {/* ERROR */}
            {!isLoading && error && (
                <ErrorState message={error} />
            )}

            {/* EMPTY */}
            {!isLoading &&
                !error &&
                products.length === 0 && (
                    <p className="mt-6 text-sm text-[var(--muted)]">
                        {hasFilters
                            ? 'No hay productos que coincidan con los filtros.'
                            : 'Aún no hay productos.'}
                    </p>
                )}

            {/* PRODUCTS */}
            {!isLoading &&
                !error &&
                products.length > 0 && (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {products.map((product) => (
                                <AdminProductCard
                                    key={product.id}
                                    product={product}
                                    isDeleting={deletingId === product.id}
                                    onEdit={() =>
                                        navigate(
                                            `/admin/products/${product.id}/edit`,
                                        )
                                    }
                                    onDelete={() =>
                                        handleDelete(
                                            product.id,
                                            product.name,
                                        )
                                    }
                                />
                            ))}
                        </div>

                        {hasNextPage && (
                            <div className="mt-6 flex justify-center">
                                <Button
                                    variant="secondary"
                                    size="md"
                                    loading={isLoadingMore}
                                    onClick={handleLoadMore}
                                >
                                    Cargar más productos
                                </Button>
                            </div>
                        )}
                    </>
                )}
        </section>
    )
}
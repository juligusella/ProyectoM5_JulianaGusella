import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
    collection,
    doc,
    runTransaction,
} from 'firebase/firestore'
import { createOrderFromCart } from '../services/orders/orderService'
import type { CartItem } from '../types/cart'

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(() => ({
        withConverter: vi.fn(() => ({})),
    })),
    doc: vi.fn(() => ({
        id: 'order-test-1',
        withConverter: vi.fn(() => ({ id: 'order-test-1' })),
    })),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    orderBy: vi.fn(),
    query: vi.fn(),
    runTransaction: vi.fn(),
    serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP'),
    updateDoc: vi.fn(),
    where: vi.fn(),
}))

vi.mock('../services/firebase/config', () => ({
    db: {},
}))

const validItem = {
    productId: 'product-1',
    name: 'Monstera Deliciosa',
    price: 15000,
    imageUrl: 'https://example.com/monstera.jpg',
    quantity: 1,
} as CartItem

const mockTransaction = vi.mocked(runTransaction)

function configureTransaction({
    exists = true,
    data = {
        name: 'Monstera Deliciosa',
        nameLower: 'monstera deliciosa',
        description: 'Planta de interior',
        price: 15000,
        category: 'plantas',
        stock: 5,
        imageUrl: 'https://example.com/monstera.jpg',
    },
}: {
    exists?: boolean
    data?: Record<string, unknown>
} = {}) {
    const transaction = {
        get: vi.fn().mockResolvedValue({
            id: 'product-1',
            exists: () => exists,
            data: () => data,
        }),
        update: vi.fn(),
        set: vi.fn(),
    }

    mockTransaction.mockImplementation(async (_db, callback) => {
        return callback(transaction as never)
    })

    return transaction
}

describe('createOrderFromCart', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('validaciones', () => {
        it('rechaza una compra sin usuario', async () => {
            await expect(
                createOrderFromCart({
                    userId: '',
                    items: [validItem],
                }),
            ).rejects.toThrow('Debés iniciar sesión para comprar.')
        })

        it('rechaza un carrito vacío', async () => {
            await expect(
                createOrderFromCart({
                    userId: 'customer-1',
                    items: [],
                }),
            ).rejects.toThrow('No podés crear una orden vacía.')
        })

        it('rechaza cantidades inválidas', async () => {
            await expect(
                createOrderFromCart({
                    userId: 'customer-1',
                    items: [{ ...validItem, quantity: 0 }],
                }),
            ).rejects.toThrow(
                'Cantidad inválida para "Monstera Deliciosa".',
            )
        })
    })

    describe('validaciones de Firestore', () => {
        it('rechaza un producto que no existe', async () => {
            configureTransaction({ exists: false })

            await expect(
                createOrderFromCart({
                    userId: 'customer-1',
                    items: [validItem],
                }),
            ).rejects.toThrow('No existe el producto product-1.')
        })

        it('rechaza la compra si el stock es insuficiente', async () => {
            configureTransaction({
                data: {
                    name: 'Monstera Deliciosa',
                    price: 15000,
                    stock: 0,
                    imageUrl: 'https://example.com/monstera.jpg',
                },
            })

            await expect(
                createOrderFromCart({
                    userId: 'customer-1',
                    items: [validItem],
                }),
            ).rejects.toThrow(
                'Stock insuficiente para "Monstera Deliciosa". Disponibles: 0.',
            )
        })

        it('rechaza los datos inválidos del producto', async () => {
            configureTransaction({
                data: {
                    name: 'Monstera Deliciosa',
                    price: -10,
                    stock: 5,
                    imageUrl: 'https://example.com/monstera.jpg',
                },
            })

            await expect(
                createOrderFromCart({
                    userId: 'customer-1',
                    items: [validItem],
                }),
            ).rejects.toThrow(
                'Los datos del producto product-1 no son válidos.',
            )
        })
    })

    it('descuenta el stock y crea la orden con el precio actual', async () => {
        const transaction = configureTransaction()

        const orderId = await createOrderFromCart({
            userId: 'customer-1',
            items: [{ ...validItem, price: 1 }],
        })

        expect(orderId).toBe('order-test-1')
        expect(transaction.update).toHaveBeenCalledWith(
            expect.anything(),
            { stock: 4 },
        )
        expect(transaction.set).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                userId: 'customer-1',
                total: 15000,
                status: 'pending',
                items: [
                    expect.objectContaining({
                        productId: 'product-1',
                        priceAtPurchase: 15000,
                        quantity: 1,
                    }),
                ],
            }),
        )
        expect(collection).toHaveBeenCalled()
        expect(doc).toHaveBeenCalled()
    })
})

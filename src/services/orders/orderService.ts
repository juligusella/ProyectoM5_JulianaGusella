import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    runTransaction,
    serverTimestamp,
    updateDoc,
    where,
    type DocumentData,
    type FirestoreDataConverter,
    type QueryDocumentSnapshot,
    type SnapshotOptions,
    type Timestamp,
    type WithFieldValue,
} from 'firebase/firestore'

import { db } from '../firebase/config'
import type { CartItem } from '../../types/cart'
import type { Order, OrderStatus, OrderItem } from '../../types/order'
import type { Product } from '../../types/product'

type OrderFirestore = Omit<Order, 'createdAt'> & {
    createdAt: Timestamp
    updatedAt?: Timestamp
}

export interface CreateOrderData {
    userId: string
    items: CartItem[]
}

const orderConverter: FirestoreDataConverter<Order> = {
    toFirestore(order: WithFieldValue<Order>): DocumentData {
        const { id: _id, ...data } = order
        return data
    },

    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options?: SnapshotOptions,
    ): Order {
        const data = snapshot.data(options) as OrderFirestore

        return {
            ...data,
            id: snapshot.id,
            createdAt: data.createdAt.toDate(),
            ...(data.updatedAt
                ? { updatedAt: data.updatedAt.toDate() }
                : {}),
        } satisfies Order
    },
}

function ordersCol() {
    return collection(db, 'orders').withConverter(orderConverter)
}

export async function createOrderFromCart(
    orderData: CreateOrderData,
): Promise<string> {
    const { userId, items } = orderData

    if (!userId) {
        throw new Error('Debés iniciar sesión para comprar.')
    }

    if (items.length === 0) {
        throw new Error('No podés crear una orden vacía.')
    }

    for (const item of items) {
        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
            throw new Error(`Cantidad inválida para "${item.name}".`)
        }
    }

    const orderRef = doc(ordersCol())

    const quantities = new Map<string, number>()

    for (const item of items) {
        quantities.set(
            item.productId,
            (quantities.get(item.productId) ?? 0) + item.quantity,
        )
    }

    const productRefs = [...quantities.keys()].map((productId) =>
        doc(db, 'products', productId),
    )

    await runTransaction(db, async (transaction) => {

        const snapshots = await Promise.all(
            productRefs.map((ref) => transaction.get(ref)),
        )

        const products = new Map<string, Product>()

        snapshots.forEach((snapshot) => {
            if (!snapshot.exists()) {
                throw new Error(`No existe el producto ${snapshot.id}.`)
            }

            const data = snapshot.data()

            if (
                typeof data.price !== 'number' ||
                !Number.isFinite(data.price) ||
                data.price < 0 ||
                typeof data.stock !== 'number' ||
                !Number.isInteger(data.stock) ||
                data.stock < 0 ||
                typeof data.name !== 'string' ||
                typeof data.imageUrl !== 'string'
            ) {
                throw new Error(
                    `Los datos del producto ${snapshot.id} no son válidos.`,
                )
            }

            products.set(snapshot.id, {
                id: snapshot.id,
                name: data.name,
                nameLower: data.nameLower,
                description: data.description,
                price: data.price,
                category: data.category,
                imageUrl: data.imageUrl,
                stock: data.stock,
            })
        })

        for (const [productId, quantity] of quantities) {
            const product = products.get(productId)!

            if (product.stock < quantity) {
                throw new Error(
                    `Stock insuficiente para "${product.name}". ` +
                    `Disponibles: ${product.stock}.`,
                )
            }
        }

        const orderItems: OrderItem[] = items.map((item) => {
            const product = products.get(item.productId)!

            return {
                productId: product.id,
                name: product.name,
                priceAtPurchase: product.price,
                quantity: item.quantity,
                imageUrl: product.imageUrl,
            }
        })

        const total = orderItems.reduce(
            (sum, item) => sum + item.priceAtPurchase * item.quantity,
            0,
        )

        for (const [productId, quantity] of quantities) {
            const product = products.get(productId)!

            transaction.update(
                doc(db, 'products', productId),
                { stock: product.stock - quantity },
            )
        }

        transaction.set(orderRef.withConverter(null), {
            userId,
            items: orderItems,
            total,
            status: 'pending',
            createdAt: serverTimestamp(),
        })
    })

    return orderRef.id
}

export async function getOrderById(
    orderId: string,
): Promise<Order | null> {
    const snapshot = await getDoc(doc(ordersCol(), orderId))

    return snapshot.exists() ? snapshot.data() : null
}

export async function getOrdersByUser(
    userId: string,
): Promise<Order[]> {
    const ordersQuery = query(
        ordersCol(),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
    )

    const snapshot = await getDocs(ordersQuery)

    return snapshot.docs.map((document) => document.data())
}

export async function listOrdersAdmin(params?: {
    status?: OrderStatus
}): Promise<Order[]> {
    const ordersQuery = params?.status
        ? query(
            ordersCol(),
            where('status', '==', params.status),
            orderBy('createdAt', 'desc'),
        )
        : query(ordersCol(), orderBy('createdAt', 'desc'))

    const snapshot = await getDocs(ordersQuery)

    return snapshot.docs.map((document) => document.data())
}

export async function updateOrderStatusAdmin(
    orderId: string,
    nextStatus: OrderStatus,
): Promise<void> {
    await updateDoc(doc(db, 'orders', orderId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
    })
}
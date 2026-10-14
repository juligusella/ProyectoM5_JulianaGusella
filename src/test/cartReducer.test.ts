
import { describe, it, expect } from 'vitest'
import { cartReducer, initialState } from '../reducers/cartReducer'
import type { Product } from '../types/product'

const product: Product = {
    id: 'product-1',
    name: 'Ficus Lyrata',
    nameLower: 'ficus lyrata',
    description: 'Planta de interior',
    price: 15000,
    category: 'plantas',
    imageUrl: 'https://example.com/ficus.jpg',
    stock: 10,
}

describe('cartReducer', () => {
    it('agrega un producto nuevo con cantidad 1', () => {
        const result = cartReducer(initialState, {
            type: 'ADD_ITEM',
            payload: product,
        })

        expect(result.items).toHaveLength(1)
        expect(result.items[0].productId).toBe(product.id)
        expect(result.items[0].quantity).toBe(1)
    })

    it('incrementa la cantidad si el producto ya existe', () => {
        const state = cartReducer(initialState, {
            type: 'ADD_ITEM',
            payload: product,
        })

        const result = cartReducer(state, {
            type: 'ADD_ITEM',
            payload: product,
        })

        expect(result.items).toHaveLength(1)
        expect(result.items[0].quantity).toBe(2)
    })

    it('no permite disminuir la cantidad por debajo de 1', () => {
        const state = cartReducer(initialState, {
            type: 'ADD_ITEM',
            payload: product,
        })

        const result = cartReducer(state, {
            type: 'DECREMENT_QUANTITY',
            payload: product.id,
        })

        expect(result.items).toHaveLength(1)
        expect(result.items[0].quantity).toBe(1)
    })

    it('elimina un producto por su ID', () => {
        const state = cartReducer(initialState, {
            type: 'ADD_ITEM',
            payload: product,
        })

        const result = cartReducer(state, {
            type: 'REMOVE_ITEM',
            payload: product.id,
        })

        expect(result.items).toHaveLength(0)
    })

    it('vacía el carrito', () => {
        const state = cartReducer(initialState, {
            type: 'ADD_ITEM',
            payload: product,
        })

        const result = cartReducer(state, {
            type: 'CLEAR_CART',
        })

        expect(result.items).toHaveLength(0)
    })
})


import { describe, it, expect } from 'vitest'
import { favoritesReducer, initialState } from './FavoritesReducer'
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

describe('favoritesReducer', () => {
    it('agrega un producto a favoritos', () => {
        const result = favoritesReducer(initialState, {
            type: 'ADD_FAVORITE',
            payload: product,
        })

        expect(result.items).toHaveLength(1)
        expect(result.items[0]).toEqual(product)
    })

    it('no duplica un producto que ya está en favoritos', () => {
        const state = favoritesReducer(initialState, {
            type: 'ADD_FAVORITE',
            payload: product,
        })

        const result = favoritesReducer(state, {
            type: 'ADD_FAVORITE',
            payload: product,
        })

        expect(result.items).toHaveLength(1)
    })

    it('elimina un favorito por su ID', () => {
        const state = favoritesReducer(initialState, {
            type: 'ADD_FAVORITE',
            payload: product,
        })

        const result = favoritesReducer(state, {
            type: 'REMOVE_FAVORITE',
            payload: product.id,
        })

        expect(result.items).toHaveLength(0)
    })

    it('vacía la lista de favoritos', () => {
        const state = favoritesReducer(initialState, {
            type: 'ADD_FAVORITE',
            payload: product,
        })

        const result = favoritesReducer(state, {
            type: 'CLEAR_FAVORITES',
        })

        expect(result.items).toHaveLength(0)
    })

    it('no modifica el estado original al agregar un favorito', () => {
        const result = favoritesReducer(initialState, {
            type: 'ADD_FAVORITE',
            payload: product,
        })

        expect(initialState.items).toHaveLength(0)
        expect(result).not.toBe(initialState)
    })
})

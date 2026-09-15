import type { Product } from '../../types/product'

export type FavoritesItem = Product

export type FavoritesState = {
  items: FavoritesItem[]
}

export type FavoritesAction =
  | {
      type: 'ADD_FAVORITE'
      payload: Product
    }
  | {
      type: 'REMOVE_FAVORITE'
      payload: string
    }
  | {
      type: 'CLEAR_FAVORITES'
    }

export interface FavoritesContextType {
  items: FavoritesItem[]
  addFavorite: (product: Product) => void
  removeFavorite: (id: string) => void
  clearFavorites: () => void
}
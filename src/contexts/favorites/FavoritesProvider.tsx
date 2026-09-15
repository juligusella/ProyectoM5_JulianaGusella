import { useReducer } from 'react'
import type { ReactNode } from 'react'

import { FavoritesContext } from './FavoritesContext'
import {
  favoritesReducer,
  initialState,
} from '../../reducers/FavoritesReducer'

import type { Product } from '../../types/product'

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({
  children,
}: FavoritesProviderProps) {
  const [state, dispatch] = useReducer(
    favoritesReducer,
    initialState,
  )

  function addFavorite(product: Product) {
    dispatch({
      type: 'ADD_FAVORITE',
      payload: product,
    })
  }

  function removeFavorite(id: string) {
    dispatch({
      type: 'REMOVE_FAVORITE',
      payload: id,
    })
  }

  function clearFavorites() {
    dispatch({
      type: 'CLEAR_FAVORITES',
    })
  }

  return (
    <FavoritesContext.Provider
      value={{
        items: state.items,
        addFavorite,
        removeFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}
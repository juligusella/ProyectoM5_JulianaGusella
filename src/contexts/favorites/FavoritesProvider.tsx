
import { useEffect, useReducer, useState } from 'react'
import type { ReactNode } from 'react'

import { FavoritesContext } from './FavoritesContext'
import {
  favoritesReducer,
  initialState,
} from '../../reducers/FavoritesReducer'
import type { Product } from '../../types/product'
import { useAuth } from '../../hooks/useAuth'

interface FavoritesProviderProps {
  children: ReactNode
}

function getInitialState(userId: string) {
  try {
    const savedFavorites = localStorage.getItem(
      `savia-favorites-${userId}`,
    )

    if (!savedFavorites) return initialState

    const parsed: unknown = JSON.parse(savedFavorites)

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'items' in parsed &&
      Array.isArray(parsed.items)
    ) {
      return { items: parsed.items as Product[] }
    }
  } catch (error) {
    console.error('No se pudieron recuperar los favoritos:', error)
  }

  return initialState
}

export function FavoritesProvider({
  children,
}: FavoritesProviderProps) {
  const { user, loading } = useAuth()
  const userId = user?.uid

  const [state, dispatch] = useReducer(
    favoritesReducer,
    initialState,
  )
  const [loadedUserId, setLoadedUserId] = useState<string | undefined>()

  useEffect(() => {
    if (loading) return

    if (!userId) {
      dispatch({ type: 'CLEAR_FAVORITES' })
      setLoadedUserId(undefined)
      return
    }

    dispatch({
      type: 'LOAD_FAVORITES',
      payload: getInitialState(userId),
    })
    setLoadedUserId(userId)
  }, [userId, loading])

  useEffect(() => {
    if (loading || !userId || loadedUserId !== userId) return

    try {
      localStorage.setItem(
        `savia-favorites-${userId}`,
        JSON.stringify(state),
      )
    } catch (error) {
      console.error('No se pudieron guardar los favoritos:', error)
    }
  }, [state, userId, loading, loadedUserId])

  function addFavorite(product: Product) {
    dispatch({ type: 'ADD_FAVORITE', payload: product })
  }

  function removeFavorite(id: string) {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id })
  }

  function clearFavorites() {
    dispatch({ type: 'CLEAR_FAVORITES' })
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

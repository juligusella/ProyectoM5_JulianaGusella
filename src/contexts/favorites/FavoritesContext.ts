import { createContext } from 'react'
import type { FavoritesContextType } from './FavoritesContext.types'

export const FavoritesContext =
  createContext<FavoritesContextType | undefined>(undefined)
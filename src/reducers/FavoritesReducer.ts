import type {
  FavoritesAction,
  FavoritesState,
} from '../contexts/favorites/FavoritesContext.types'

export const initialState: FavoritesState = {
  items: [],
}

export function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction,
): FavoritesState {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      const exists = state.items.some(
        (item) => item.id === action.payload.id,
      )

      if (exists) {
        return state
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      }
    }

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        items: state.items.filter(
          (item) => item.id !== action.payload,
        ),
      }

    case 'CLEAR_FAVORITES':
      return {
        ...state,
        items: [],
      }

    default:
      return state
  }
}
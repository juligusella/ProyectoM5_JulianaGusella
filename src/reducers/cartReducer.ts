
import type { CartState } from '../types/cart'
import type { Product } from '../types/product'

export const initialState: CartState = {
  items: [],
}

export type CartAction =
  | {
    type: 'ADD_ITEM'
    payload: Product
  }
  | {
    type: 'REMOVE_ITEM'
    payload: string
  }
  | {
    type: 'INCREMENT_QUANTITY'
    payload: string
  }
  | {
    type: 'DECREMENT_QUANTITY'
    payload: string
  }
  | {
    type: 'CLEAR_CART'
  }
  | {
    type: 'LOAD_CART'
    payload: CartState
  }

export const cartReducer = (
  state: CartState,
  action: CartAction,
): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.id,
      )

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: action.payload.id,
            name: action.payload.name,
            price: action.payload.price,
            imageUrl: action.payload.imageUrl,
            quantity: 1,
          },
        ],
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (item) => item.productId !== action.payload,
        ),
      }

    case 'INCREMENT_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      }

    case 'DECREMENT_QUANTITY': {
      const item = state.items.find(
        (item) => item.productId === action.payload,
      )

      if (!item || item.quantity <= 1) {
        return state
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      }
    }

    case 'LOAD_CART':
      return action.payload

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      }

    default:
      return state
  }
}

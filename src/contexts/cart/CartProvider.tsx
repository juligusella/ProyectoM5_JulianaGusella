
import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Product } from '../../types/product'
import type { CartState } from '../../types/cart'
import { cartReducer, initialState } from '../../reducers/cartReducer'
import { CartContext } from './CartContext'

interface CartProviderProps {
  children: ReactNode
}

const CART_STORAGE_KEY = 'savia-cart'

function getInitialState(): CartState {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)

    if (!savedCart) {
      return initialState
    }

    const parsedCart: unknown = JSON.parse(savedCart)

    if (
      typeof parsedCart === 'object' &&
      parsedCart !== null &&
      'items' in parsedCart &&
      Array.isArray(parsedCart.items)
    ) {
      return { items: parsedCart.items }
    }

    return initialState
  } catch {
    return initialState
  }
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    getInitialState,
  )

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('No se pudo guardar el carrito:', error)
    }
  }, [state])

  // Estados derivados
  const total = state.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )

  const totalItems = state.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  )

  // Acciones
  function addItem(product: Product) {
    dispatch({
      type: 'ADD_ITEM',
      payload: product,
    })
  }

  function removeItem(id: string) {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: id,
    })
  }

  function incrementQuantity(id: string) {
    dispatch({
      type: 'INCREMENT_QUANTITY',
      payload: id,
    })
  }

  function decrementQuantity(id: string) {
    dispatch({
      type: 'DECREMENT_QUANTITY',
      payload: id,
    })
  }

  function clearCart() {
    dispatch({
      type: 'CLEAR_CART',
    })
  }

  const value = useMemo(
    () => ({
      items: state.items,
      total,
      totalItems,
      addItem,
      removeItem,
      incrementQuantity,
      decrementQuantity,
      clearCart,
    }),
    [state.items, total, totalItems],
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}



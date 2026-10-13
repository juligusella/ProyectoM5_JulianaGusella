
import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import type { Product } from '../../types/product'
import type { CartState } from '../../types/cart'
import { cartReducer, initialState } from '../../reducers/cartReducer'
import { CartContext } from './CartContext'
import { useAuth } from '../../hooks/useAuth'

interface CartProviderProps {
  children: ReactNode
}

function getInitialState(userId: string): CartState {
  try {
    const savedCart = localStorage.getItem(`savia-cart-${userId}`)

    if (!savedCart) return initialState

    const parsedCart: unknown = JSON.parse(savedCart)

    if (
      typeof parsedCart === 'object' &&
      parsedCart !== null &&
      'items' in parsedCart &&
      Array.isArray(parsedCart.items)
    ) {
      return { items: parsedCart.items as CartState['items'] }
    }
  } catch (error) {
    console.error('No se pudo recuperar el carrito:', error)
  }

  return initialState
}

export function CartProvider({ children }: CartProviderProps) {
  const { user, loading } = useAuth()
  const userId = user?.uid

  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [loadedUserId, setLoadedUserId] = useState<string | undefined>()

  useEffect(() => {
    if (loading) return

    if (!userId) {
      dispatch({ type: 'CLEAR_CART' })
      setLoadedUserId(undefined)
      return
    }

    dispatch({
      type: 'LOAD_CART',
      payload: getInitialState(userId),
    })
    setLoadedUserId(userId)
  }, [userId, loading])

  useEffect(() => {
    if (loading || !userId || loadedUserId !== userId) return

    try {
      localStorage.setItem(
        `savia-cart-${userId}`,
        JSON.stringify(state),
      )
    } catch (error) {
      console.error('No se pudo guardar el carrito:', error)
    }
  }, [state, userId, loading, loadedUserId])

  const total = state.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )

  const totalItems = state.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  )

  function addItem(product: Product) {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }

  function removeItem(id: string) {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  function incrementQuantity(id: string) {
    dispatch({ type: 'INCREMENT_QUANTITY', payload: id })
  }

  function decrementQuantity(id: string) {
    dispatch({ type: 'DECREMENT_QUANTITY', payload: id })
  }

  function clearCart() {
    dispatch({ type: 'CLEAR_CART' })
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

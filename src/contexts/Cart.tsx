import React, { createContext, useState, useCallback, useContext, useEffect } from 'react'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { OrderProduct } from '../services/apiFunctions/clients/orders/types'
import { Company } from '../services/apiFunctions/companies/company/types'
import { useToast } from './Toast'
import { useClientAuth } from './AuthClient'
import {
  addProductInCart,
  getCart,
  clearCart as clearCartApiFunction,
  updateCart as updateCartApiFunction,
} from '../services/apiFunctions/clients/cart'
import { Cart } from '../services/apiFunctions/clients/cart/types'

interface CartContext {
  cart: Cart
  addToCart(orderProduct: OrderProduct): void
  updateCart: ({ orderProducts }: { orderProducts: OrderProduct[] }) => Promise<void>
  clearCart(): void
  company: Company | null
  setCompany: React.Dispatch<React.SetStateAction<Company | null>>
}

const CartContext = createContext<CartContext | null>(null)

const CartProvider: React.FC = ({ children }) => {
  const [cart, setCart] = useState<Cart>()
  const [company, setCompany] = useState<Company | null>(null)

  const { addToast } = useToast()
  const { client } = useClientAuth()

  useEffect(() => {
    if (!client) return

    getCart({ companyId: company._id }).then((response) => {
      setCart(response)
    })
  }, [company, client])

  const addToCart = useCallback(
    async (orderProduct: OrderProduct) => {
      if (!company) return
      if (!client) return

      const cart = await addProductInCart({ companyId: company._id, orderProduct })

      setCart(cart)

      addToast({
        title: 'Produto adicionado ao carrinho',
        status: 'success',
      })
    },
    [addToast, client, company]
  )

  const clearCart = useCallback(async () => {
    if (!cart) return
    await clearCartApiFunction({ cartId: cart._id })
  }, [cart])

  const updateCart = useCallback(
    async ({ orderProducts }: { orderProducts: OrderProduct[] }) => {
      if (!cart) return

      const cartUpdated = await updateCartApiFunction({ cartId: cart._id, orderProducts })

      setCart(cartUpdated)

      addToast({
        title: 'Produto removido',
        status: 'info',
      })
    },
    [addToast, cart]
  )

  return (
    <CartContext.Provider
      value={{
        addToCart,
        clearCart,
        cart,
        company,
        setCompany,
        updateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

function useCart(): CartContext {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`)
  }

  return context
}

export { CartProvider, useCart }

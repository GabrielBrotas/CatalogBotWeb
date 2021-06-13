import React, { createContext, useState, useCallback, useContext, useEffect, useMemo } from 'react'
import { OrderProduct, PaymentMethods } from '../services/apiFunctions/clients/orders/types'
import { Company } from '../services/apiFunctions/companies/company/types'
import { useToast } from './Toast'
import { useClientAuth } from './AuthClient'
import {
  addProductInCart,
  getCart,
  clearCart as clearCartApiFunction,
  updateCart as updateCartApiFunction,
} from '../services/apiFunctions/clients/cart'
import { Cart, CartOrderProduct } from '../services/apiFunctions/clients/cart/types'
import { createOrder } from '../services/apiFunctions/clients/orders'
import { Address } from '../services/apiFunctions/clients/client/types'

type StoreOrderDTO = {
  deliveryAddress: Address
  paymentMethod: PaymentMethods
}

interface CartContext {
  cart: Cart
  addToCart(orderProduct: OrderProduct): Promise<void>
  updateCart: ({ orderProducts }: { orderProducts: OrderProduct[] }) => Promise<void>
  clearCart(): Promise<void>
  company: Company | null
  setCompany: React.Dispatch<React.SetStateAction<Company | null>>
  isCartModalOpen: boolean
  setIsCartModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  storeOrder: ({ deliveryAddress, paymentMethod }: StoreOrderDTO) => Promise<void>
  orderTotalPrice: number
}

const CartContext = createContext<CartContext | null>(null)

function formatCartProductsToOrderProducts(cartProducts: CartOrderProduct[]): OrderProduct[] {
  const formatedCartProducts = cartProducts.map((cartProduct) => ({
    product: cartProduct.product._id,
    amount: cartProduct.amount,
    pickedOptions: cartProduct.pickedOptions,
    comment: cartProduct.comment,
  }))

  return formatedCartProducts
}

const CartProvider: React.FC = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>()
  const [company, setCompany] = useState<Company | null>(null)
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)

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

      try {
        const cart = await addProductInCart({ companyId: company._id, orderProduct })

        setCart(cart)
      } catch (err) {
        console.log(err)
      }
    },
    [client, company]
  )

  const clearCart = useCallback(async () => {
    if (!cart) return
    if (!client) return

    try {
      await clearCartApiFunction({ cartId: cart._id })
      setCart(null)
    } catch (err) {
      console.log(err)
    }
  }, [cart, client])

  const updateCart = useCallback(
    async ({ orderProducts }: { orderProducts: OrderProduct[] }) => {
      if (!cart) return
      if (!client) return

      try {
        const cartUpdated = await updateCartApiFunction({ cartId: cart._id, orderProducts })
        setCart(cartUpdated)
      } catch (err) {
        console.log(err)
        addToast({
          title: 'Desculpe, algo deu errado!',
          status: 'error',
        })
      }
    },
    [addToast, cart, client]
  )

  const orderTotalPrice = useMemo(() => {
    if (!company) return
    if (!client) return

    if (!cart || cart.orderProducts.length <= 0) return 0
    const totalPrice = cart.orderProducts.reduce(
      (acc, currentProduct) =>
        acc +
        currentProduct.product.price +
        currentProduct.pickedOptions.reduce(
          (acc, currentOption) =>
            acc +
            currentOption.optionAdditionals.reduce(
              (acc, currentOptionAdditional) =>
                acc + currentOptionAdditional.price * currentOptionAdditional.amount,
              0
            ),
          0
        ),
      0
    )
    return totalPrice
  }, [cart, client, company])

  const storeOrder = useCallback(
    async ({ deliveryAddress, paymentMethod }: StoreOrderDTO) => {
      if (!company) return
      if (!client) return

      try {
        const formatedOrderProducts = formatCartProductsToOrderProducts(cart.orderProducts)
        await createOrder({
          companyId: company._id,
          deliveryAddress,
          orderProducts: formatedOrderProducts,
          paymentMethod,
          totalPrice: orderTotalPrice,
        })
        await clearCart()
      } catch (err) {
        console.log(err)
        addToast({
          title: 'Desculpe, algo deu errado!',
          status: 'error',
        })
      }
    },
    [addToast, cart, clearCart, client, company, orderTotalPrice]
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
        isCartModalOpen,
        setIsCartModalOpen,
        storeOrder,
        orderTotalPrice,
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

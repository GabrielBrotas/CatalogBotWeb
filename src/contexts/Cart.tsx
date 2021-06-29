import React, { createContext, useState, useCallback, useContext, useEffect, useMemo } from 'react'
import { OrderProduct, PaymentMethods } from '../services/apiFunctions/clients/orders/types'
import { Company } from '../services/apiFunctions/companies/company/types'
import { useToast } from './Modals/Toast'
import { useClientAuth } from './AuthClient'
import {
  addProductInCart,
  getCart,
  clearCart as clearCartApiFunction,
  updateCart as updateCartApiFunction,
} from '../services/apiFunctions/clients/cart'
import {
  Cart,
  CartOrderProduct,
  StoreCartOrderProductDTO,
} from '../services/apiFunctions/clients/cart/types'
import { createOrder } from '../services/apiFunctions/clients/orders'
import { Address } from '../services/apiFunctions/clients/client/types'
import { useDisclosure } from '@chakra-ui/react'
import { getTotalPriceFromCartOrderProduct } from '../utils/maths'
import { currencyFormat } from '../utils/dataFormat'
import { useWebSockets } from '../hooks/useWebSocket'

type StoreOrderDTO = {
  deliveryAddress: Address
  paymentMethod: PaymentMethods
  cartOrderProducts: CartOrderProduct[]
  saveAddressAsDefault?: boolean
}

interface CartFormated extends Cart {
  cartTotalPrice: number
  cartTotalPriceFormated: string
}
interface CartContext {
  cart: CartFormated
  addToCart(orderProduct: StoreCartOrderProductDTO): Promise<void>
  updateCart: ({ orderProducts }: { orderProducts: StoreCartOrderProductDTO[] }) => Promise<void>
  clearCart(): Promise<void>
  company: Company | null
  setCompany: React.Dispatch<React.SetStateAction<Company | null>>
  isModalOpen: boolean
  openCartModal: () => void
  closeCartModal: () => void
  storeOrder: ({ deliveryAddress, paymentMethod }: StoreOrderDTO) => Promise<void>
  orderTotalPrice: number
}

const CartContext = createContext<CartContext>({} as CartContext)

function formatCartProductsToOrderProducts(cartProducts: CartOrderProduct[]): OrderProduct[] {
  const formatedCartProducts = cartProducts.map((cartProduct) => ({
    product: {
      _id: cartProduct.product._id,
      name: cartProduct.product.name,
      price: cartProduct.product.price,
      imageUrl: cartProduct.product.imageUrl,
    },
    amount: cartProduct.amount,
    pickedOptions: cartProduct.pickedOptions,
    comment: cartProduct.comment,
  }))

  return formatedCartProducts
}

const CartProvider: React.FC = ({ children }) => {
  const [cart, setCart] = useState<CartFormated | null>()
  const [company, setCompany] = useState<Company>()
  const { isOpen: isModalOpen, onOpen, onClose: closeCartModal } = useDisclosure()

  const { addToast } = useToast()
  const { client } = useClientAuth()

  const { eventUpdateOrderStatus } = useWebSockets({
    userId: client && client._id,
    enabled: !!client,
  })

  useEffect(() => {
    if (!client) return
    if (!company) return
    getCart({ companyId: company._id }).then((response) => {
      if (response) {
        setCart({
          ...response,
          cartTotalPrice: getTotalPriceFromCartOrderProduct(response.orderProducts),
          cartTotalPriceFormated: currencyFormat(
            getTotalPriceFromCartOrderProduct(response.orderProducts)
          ),
        })
      }
    })
  }, [company, client])

  const openCartModal = () => {
    if (cart && cart.orderProducts && cart.orderProducts.length > 0) {
      onOpen()
    } else {
      addToast({
        title: 'Seu carrinho está vazio',
        status: 'info',
      })
    }
  }

  const addToCart = useCallback(
    async (orderProduct: StoreCartOrderProductDTO) => {
      if (!company) return
      if (!client) return

      try {
        const cart = await addProductInCart({ companyId: company._id, orderProduct })

        setCart({
          ...cart,
          cartTotalPrice: getTotalPriceFromCartOrderProduct(cart.orderProducts),
          cartTotalPriceFormated: currencyFormat(
            getTotalPriceFromCartOrderProduct(cart.orderProducts)
          ),
        })
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
    async ({ orderProducts }: { orderProducts: StoreCartOrderProductDTO[] }) => {
      if (!cart) return
      if (!client) return

      try {
        const cartUpdated = await updateCartApiFunction({ cartId: cart._id, orderProducts })
        setCart({
          ...cartUpdated,
          cartTotalPrice: getTotalPriceFromCartOrderProduct(cartUpdated.orderProducts),
          cartTotalPriceFormated: currencyFormat(
            getTotalPriceFromCartOrderProduct(cartUpdated.orderProducts)
          ),
        })
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
                acc + Number(currentOptionAdditional.price) * currentOptionAdditional.amount,
              0
            ),
          0
        ),
      0
    )
    return totalPrice
  }, [cart, client, company])

  const storeOrder = useCallback(
    async ({
      deliveryAddress,
      paymentMethod,
      cartOrderProducts,
      saveAddressAsDefault = true,
    }: StoreOrderDTO) => {
      if (!company) return
      if (!client) return

      try {
        const orderProducts = formatCartProductsToOrderProducts(cartOrderProducts)

        await createOrder({
          companyId: company._id,
          deliveryAddress,
          orderProducts,
          paymentMethod,
          totalPrice: orderTotalPrice,
          saveAddressAsDefault,
        })

        eventUpdateOrderStatus({
          status: 'pending',
          Receiver: company._id,
          Sender: client._id,
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
    [addToast, clearCart, client, company, eventUpdateOrderStatus, orderTotalPrice]
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
        storeOrder,
        orderTotalPrice,
        isModalOpen,
        closeCartModal,
        openCartModal,
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

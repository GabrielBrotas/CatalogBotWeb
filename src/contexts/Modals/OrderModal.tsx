import { useDisclosure } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { createContext, ReactNode, useCallback, useContext } from 'react'
import { useWebSockets } from '../../hooks/useWebSocket'
import { getMyOrders, updateOrder } from '../../services/apiFunctions/clients/orders'
import { IPaginatedOrders, OrderFormated } from '../../services/apiFunctions/clients/orders/types'
import { currencyFormat, tranformOrderFormatedInOrderToUpdate } from '../../utils/dataFormat'
import { getTotalPriceFromOrderProduct } from '../../utils/maths'
import { useClientAuth } from '../AuthClient'

interface OrderModalProps {
  children: ReactNode
}

interface OrderModalContextProps {
  openOrderModal(): void
  isOrderModalOpen: boolean
  handleCloseOrderModal: () => void
  orders: IPaginatedOrders
  selectedOrder: OrderFormated
  setSelectedOrder: Dispatch<SetStateAction<OrderFormated>>
  cancelOrder: (order: OrderFormated) => Promise<void>
  setOrders: Dispatch<SetStateAction<IPaginatedOrders>>
}

const OrderModalContext = createContext({} as OrderModalContextProps)

export function OrderModalProvider({ children }: OrderModalProps) {
  const { isOpen: isOrderModalOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  const [orders, setOrders] = useState<IPaginatedOrders>()
  const [selectedOrder, setSelectedOrder] = useState<OrderFormated>()

  const { isAuthenticated: isClientAuthenticated, client, newNotification } = useClientAuth()

  const { eventUpdateOrderStatus } = useWebSockets({
    userId: client && client._id,
    enabled: !!isClientAuthenticated,
  })

  const companyId = router.query.companyId && String(router.query.companyId)

  useEffect(() => {
    if (isClientAuthenticated && !!companyId) {
      getMyOrders({ companyId: companyId })
        .then((res) => {
          const ordersFormated = res.results.map((order) => ({
            ...order,
            dateFormated: dayjs(order.created_at).format('DD/MM/YYYY - HH:mm'),
            totalPriceFormated: currencyFormat(Number(order.totalPrice)),
            orderProducts: order.orderProducts.map((orderProduct) => ({
              ...orderProduct,
              totalPriceFormated: currencyFormat(getTotalPriceFromOrderProduct(orderProduct)),
              product: {
                ...orderProduct.product,
                priceFormated: currencyFormat(orderProduct.product.price),
              },
              pickedOptions: orderProduct.pickedOptions.map((pickedOption) => ({
                ...pickedOption,
                optionAdditionals: pickedOption.optionAdditionals.map((optionAdditional) => ({
                  ...optionAdditional,
                  priceFormated: currencyFormat(Number(optionAdditional.price)),
                })),
              })),
            })),
          }))

          setOrders({
            total: res.total,
            next: res.next,
            previous: res.previous,
            results: ordersFormated,
          })
        })
        .catch((err) => console.log(err))
    }
  }, [companyId, isClientAuthenticated])

  useEffect(() => {
    if (newNotification) {
      if (newNotification.Order && newNotification.Status) {
        setOrders(({ results, total, next, previous }) => ({
          total,
          next,
          previous,
          results: results.map((order) =>
            order._id === newNotification.Order
              ? { ...order, status: newNotification.Status }
              : order
          ),
        }))
      }
    }
  }, [newNotification])

  const openOrderModal = useCallback(() => {
    onOpen()
  }, [onOpen])

  const handleCloseOrderModal = useCallback(() => {
    onClose()
    setSelectedOrder(null)
  }, [onClose])

  const cancelOrder = useCallback(
    async (order: OrderFormated) => {
      await updateOrder({
        orderId: order._id,
        data: {
          ...tranformOrderFormatedInOrderToUpdate(order),
          status: 'canceled',
        },
      })

      eventUpdateOrderStatus({
        Receiver: companyId,
        status: 'canceled',
        Sender: client._id,
        Order: order._id,
        clientWhatsapp: order.client.cellphone,
      })

      setOrders(({ results, total, next, previous }) => ({
        total,
        next,
        previous,
        results: results.map((o) => (o._id === order._id ? { ...order, status: 'canceled' } : o)),
      }))
      setSelectedOrder(null)
    },
    [client, companyId, eventUpdateOrderStatus]
  )

  return (
    <OrderModalContext.Provider
      value={{
        openOrderModal,
        isOrderModalOpen,
        handleCloseOrderModal,
        orders,
        selectedOrder,
        setSelectedOrder,
        cancelOrder,
        setOrders,
      }}
    >
      {children}
    </OrderModalContext.Provider>
  )
}

export const useOrderModal = () => useContext(OrderModalContext)

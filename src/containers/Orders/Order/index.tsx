import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Box, Button, Flex, Heading } from '@chakra-ui/react'

import { useToast } from '../../../contexts/Modals/Toast'
import { useAlertModal } from '../../../contexts/Modals/AlertModal'
import { queryClient } from '../../../services/queryClient'

import { OrderContainerProps } from '../../../pages/orders/[oId]'
import { updateOrder } from '../../../services/apiFunctions/companies/orders'
import { CompanyHeader } from '../../../components/Headers/CompanyHeader'
import { Sidebar } from '../../../components/Sidebar'
import { tranformOrderFormatedInOrderToUpdate } from '../../../utils/dataFormat'
import { ClientData } from './client-data'
import { OrderData } from './order-data'
import { useCompanyAuth } from '../../../contexts/AuthCompany'
import { useWebSockets } from '../../../hooks/useWebSocket'
// import { emmitEvent } from '../../../services/socket'

export const OrderContainer = ({ order }: OrderContainerProps) => {
  const router = useRouter()
  const { handleOpenAlertModal } = useAlertModal()
  const { addToast } = useToast()
  const { company, isAuthenticated } = useCompanyAuth()

  const { eventUpdateOrderStatus } = useWebSockets({
    userId: company && company._id,
    enabled: !!isAuthenticated,
  })

  const handleCancelOrder = async () => {
    try {
      handleOpenAlertModal({
        title: 'Cancelar ordem',
        description: 'Você tem certeza que deseja deletar cancelar esta ordem?',
        submitButtonText: 'Fechar Ordem',
        onConfirm: async () => {
          await updateOrder({
            orderId: order._id,
            data: {
              ...tranformOrderFormatedInOrderToUpdate(order),
              status: 'canceled',
            },
          })

          eventUpdateOrderStatus({
            Receiver: order.client._id,
            status: 'canceled',
            Sender: company._id,
            Order: order._id,
          })

          addToast({
            title: 'Ordem cancelada com sucesso',
            status: 'info',
          })
          queryClient.invalidateQueries('orders')
          router.push('/orders')
        },
      })
    } catch (err) {
      addToast({
        status: 'error',
        title: 'Desculpe, algo deu errado!',
        description: 'Tente novamente mais tarde',
      })
    }
  }

  const handleConfirmOrder = async () => {
    try {
      await updateOrder({
        orderId: order._id,
        data: {
          ...tranformOrderFormatedInOrderToUpdate(order),
          status: 'confirmed',
        },
      })

      eventUpdateOrderStatus({
        status: 'confirmed',
        Receiver: order.client._id,
        Sender: company._id,
        Order: order._id,
      })
      addToast({
        title: 'Ordem confirmada com sucesso',
        status: 'success',
      })
      queryClient.invalidateQueries('orders')
      router.push('/orders')
    } catch (err) {
      addToast({
        status: 'error',
        title: 'Desculpe, algo deu errado!',
        description: 'Tente novamente mais tarde',
      })
    }
  }

  const handleOrderReceived = async () => {
    try {
      await updateOrder({
        orderId: order._id,
        data: {
          ...tranformOrderFormatedInOrderToUpdate(order),
          status: 'received',
        },
      })

      eventUpdateOrderStatus({
        status: 'received',
        Receiver: order.client._id,
        Sender: company._id,
        Order: order._id,
      })

      addToast({
        title: 'Parabéns por mais uma entrega!',
        status: 'success',
      })
      queryClient.invalidateQueries('orders')
      router.push('/orders')
    } catch (err) {
      addToast({
        status: 'error',
        title: 'Desculpe, algo deu errado!',
        description: 'Tente novamente mais tarde',
      })
    }
  }

  return (
    <Box w={['max-content', '100%']}>
      <CompanyHeader />

      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading as="h3" size="lg">
              Ordem
            </Heading>
            <Link href="/orders">
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="gray"
                mr="6"
                w="9rem"
                cursor="pointer"
                textColor="gray.600"
              >
                Voltar
              </Button>
            </Link>
          </Flex>

          <ClientData client={order.client} deliveryAddress={order.deliveryAddress} />

          <OrderData order={order} />

          {order.status !== 'received' && (
            <Flex w="full" justifyContent="flex-end" alignItems="center" mt="8">
              {order.status !== 'canceled' && (
                <>
                  <Button
                    as="a"
                    size="sm"
                    fontSize="sm"
                    colorScheme="red"
                    w="9rem"
                    mr="6"
                    cursor="pointer"
                    h="12"
                    onClick={handleCancelOrder}
                  >
                    Cancelar pedido
                  </Button>
                  <Button
                    as="a"
                    size="sm"
                    fontSize="sm"
                    colorScheme={order.status === 'confirmed' ? 'blue' : 'green'}
                    w="9rem"
                    h="12"
                    cursor="pointer"
                    onClick={
                      order.status === 'confirmed' ? handleOrderReceived : handleConfirmOrder
                    }
                  >
                    {order.status === 'confirmed' ? 'Pedido entregue' : 'Aceitar pedido'}
                  </Button>
                </>
              )}
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  )
}

import React, { Fragment } from 'react'
import {
  VStack,
  Flex,
  Text,
  Image,
  UnorderedList,
  ListItem,
  Heading,
  Box,
  Divider,
  useBreakpointValue,
  Button,
  AspectRatio,
} from '@chakra-ui/react'

import {
  FORMAT_PAYMENT,
  FORMAT_ORDER_STATUS,
  currencyFormat,
  ORDER_STATUS_COLOR_SECONDARY,
  tranformOrderFormatedInOrderToUpdate,
} from '../../../utils/dataFormat'
import { useOrderModal } from '../../../contexts/Modals/OrderModal'
import { useToast } from '../../../contexts/Modals/Toast'
import { useAlertModal } from '../../../contexts/Modals/AlertModal'
import { updateOrder } from '../../../services/apiFunctions/clients/orders'

export const SingleOrder = () => {
  const { selectedOrder, cancelOrder, setSelectedOrder, setOrders } = useOrderModal()
  const { handleOpenAlertModal } = useAlertModal()
  const { addToast } = useToast()

  const isMobileView = useBreakpointValue({
    base: true,
    md: false,
    lg: false,
  })

  const handleCancelOrder = async () => {
    try {
      handleOpenAlertModal({
        title: 'Cancelar pedido',
        description: 'Você tem certeza que deseja deletar cancelar este pedido?',
        submitButtonText: 'Cancelar Pedido',
        onConfirm: async () => {
          await cancelOrder(selectedOrder)
          addToast({
            title: 'Ordem cancelada com sucesso',
            status: 'success',
          })
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

  const handleReceivedOrder = async () => {
    try {
      await updateOrder({
        orderId: selectedOrder._id,
        data: {
          ...tranformOrderFormatedInOrderToUpdate(selectedOrder),
          status: 'received',
        },
      })
      setOrders(({ results, total, next, previous }) => ({
        total,
        next,
        previous,
        results: results.map((order) =>
          order._id === selectedOrder._id ? { ...selectedOrder, status: 'received' } : order
        ),
      }))
      setSelectedOrder(null)

      addToast({
        title: 'Parabens pela sua nova compra!',
        status: 'success',
      })
    } catch (err) {
      addToast({
        status: 'error',
        title: 'Desculpe, algo deu errado!',
        description: 'Tente novamente mais tarde',
      })
    }
  }

  if (!selectedOrder) return <></>

  return (
    <VStack w="full" alignItems="flex-start" mb="6">
      <Flex flexDir="column">
        <Text fontSize="lg" fontWeight="medium" mr="4" mb="2">
          Endereço de entrega:{' '}
        </Text>
        <UnorderedList marginLeft="8" spacing={2}>
          <ListItem>Estado: {selectedOrder.deliveryAddress.state}</ListItem>
          <ListItem>Cidade: {selectedOrder.deliveryAddress.city}</ListItem>
          <ListItem>Cep: {selectedOrder.deliveryAddress.cep}</ListItem>
          <ListItem>Bairro: {selectedOrder.deliveryAddress.neighborhood}</ListItem>
          <ListItem>Número: {selectedOrder.deliveryAddress.number}</ListItem>
          <ListItem>Rua: {selectedOrder.deliveryAddress.street}</ListItem>
        </UnorderedList>
      </Flex>

      <VStack w="full" alignItems="flex-start">
        <Heading as="h3" fontWeight="medium" fontSize="lg" mr="4" mt="4" mb="2">
          Dados do pedido
        </Heading>

        <Flex justifyContent="space-between" w="full">
          <Text mr="4">Forma de Pagamento:</Text>
          <Text>{FORMAT_PAYMENT[selectedOrder.paymentMethod]}</Text>
        </Flex>
        <Flex justifyContent="space-between" w="full">
          <Text mr="4">Status:</Text>
          <Text textColor={ORDER_STATUS_COLOR_SECONDARY[selectedOrder.status]}>
            {FORMAT_ORDER_STATUS[selectedOrder.status]}
          </Text>
        </Flex>
        <Flex justifyContent="space-between" w="full">
          <Text mr="4">Criada em:</Text>
          <Text>{selectedOrder.dateFormated}</Text>
        </Flex>
        <Flex justifyContent="space-between" w="full">
          <Text mr="4">Valor total da ordem:</Text>
          <Text>{selectedOrder.totalPriceFormated}</Text>
        </Flex>

        <Box w="full">
          <Text mt="6" mb="4" fontSize="lg">
            Produtos:
          </Text>

          {selectedOrder.orderProducts.map((orderProduct) => (
            <VStack key={orderProduct._id} w="full" mb="5" alignItems="flex-start">
              <Flex w="full" justifyContent="space-between" mb="2">
                <Flex alignItems="flex-start">
                  <AspectRatio ratio={4 / 3} w={'7rem'}>
                    <Image
                      objectFit="cover"
                      src={
                        orderProduct.product.imageUrl
                          ? orderProduct.product.imageUrl
                          : '/images/default-picture.jpg'
                      }
                      alt={orderProduct.product.name}
                      name={orderProduct.product.name}
                    />
                  </AspectRatio>
                  <Text ml="4">{orderProduct.product.name}</Text>
                </Flex>
                <Flex>
                  <Text mr="6">Qtd:</Text>
                  <Text>{orderProduct.amount}</Text>
                </Flex>
              </Flex>

              <Box w="full">
                {orderProduct.pickedOptions && orderProduct.pickedOptions.length > 0 && (
                  <Text mb="4">Opções escolhidas:</Text>
                )}
                {orderProduct.pickedOptions &&
                  orderProduct.pickedOptions.map((pickedOption) => (
                    <Flex key={pickedOption._id} mb="4" flexDir="column">
                      <Text w="32">{pickedOption.productOptionName}:</Text>
                      <Flex w="full" flexDir="column">
                        {pickedOption.optionAdditionals &&
                          pickedOption.optionAdditionals.map((optionAdditional) => (
                            <Box
                              key={optionAdditional._id}
                              display="flex"
                              py="1"
                              alignItems="center"
                            >
                              <Flex flex="1" alignItems="center">
                                <Text
                                  fontSize="small"
                                  bg="gray.50"
                                  textColor="gray.500"
                                  px="2"
                                  py="1"
                                  mr="2"
                                  fontWeight="bold"
                                  borderRadius="md"
                                >
                                  {optionAdditional.amount}
                                </Text>
                                <Text textColor="gray.700">{optionAdditional.name}</Text>
                              </Flex>
                              <Text textAlign="center">
                                {optionAdditional.price !== 0 &&
                                  optionAdditional.price !== '0' &&
                                  currencyFormat(
                                    Number(
                                      (
                                        optionAdditional.amount * Number(optionAdditional.price)
                                      ).toFixed(2)
                                    )
                                  )}
                              </Text>
                            </Box>
                          ))}
                      </Flex>
                    </Flex>
                  ))}

                <Text textAlign="end">Total: {orderProduct.totalPriceFormated}</Text>
              </Box>

              <Divider />
            </VStack>
          ))}
        </Box>
      </VStack>
      {(selectedOrder.status === 'pending' ||
        selectedOrder.status === 'confirmed' ||
        selectedOrder.status === 'sent') && (
        <Flex w="full" justifyContent="flex-end" alignItems="center" mt="8">
          <Button
            as="a"
            size="sm"
            fontSize="sm"
            colorScheme={selectedOrder.status === 'pending' ? 'red' : 'blue'}
            w="9rem"
            mr="6"
            cursor="pointer"
            h="12"
            onClick={selectedOrder.status === 'pending' ? handleCancelOrder : handleReceivedOrder}
          >
            {selectedOrder.status === 'pending' ? 'Cancelar pedido' : 'Pedido Recebido'}
          </Button>
        </Flex>
      )}
    </VStack>
  )
}

import React from 'react'
import Link from 'next/link'
import { Box, Button, Flex, Heading, Text, useToast, VStack } from '@chakra-ui/react'
import { OrderContainerProps } from '../../pages/orders/[oId]'
import { useAlertModal } from '../../contexts/AlertModal'
import { Header } from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { FORMAT_PAYMENT } from '../../utils/dataFormat'

export const OrderContainer = ({ order }: OrderContainerProps) => {
  // const { handleOpenAlertModal } = useAlertModal()
  // const { addToast } = useToast()
  console.log(order)
  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Ordem
            </Heading>

            <Button
              as="a"
              size="sm"
              fontSize="sm"
              colorScheme="pink"
              // leftIcon={<Icon as={RiAddLine} fontSize="20" />}
            >
              Aceitar
            </Button>

            <Button
              as="a"
              size="sm"
              fontSize="sm"
              colorScheme="red"
              // leftIcon={<Icon as={RiAddLine} fontSize="20" />}
            >
              Cancelar
            </Button>
          </Flex>

          <VStack w="full" alignItems="flex-start">
            <Flex>
              <Text mr="4">Client</Text>
              <Text>{order.client.name}</Text>
            </Flex>
            <Flex>
              <Text mr="4">Endereço: </Text>
              <Text>
                {order.deliveryAddress.cep} - {order.deliveryAddress.city} -
                {order.deliveryAddress.neighborhood}- {order.deliveryAddress.number}-{' '}
                {order.deliveryAddress.state} - {order.deliveryAddress.street}
              </Text>
            </Flex>
            <Flex>
              <Text mr="4">Forma de Pagamento</Text>
              <Text>{FORMAT_PAYMENT[order.paymentMethod]}</Text>
            </Flex>
          </VStack>

          {order.orderProducts.map((orderProduct) => (
            <VStack key={orderProduct._id} w="full" alignItems="flex-start">
              <Text fontWeight="bold">{orderProduct.product.name}</Text>
              <Box>
                {orderProduct.pickedOptions &&
                  orderProduct.pickedOptions.map((pickedOption) => (
                    <Box key={pickedOption._id}>
                      <Text>{pickedOption.productOptionName}</Text>
                      <Box>
                        {pickedOption.optionAdditionals &&
                          pickedOption.optionAdditionals.map((optionAdditional) => (
                            <Box key={optionAdditional._id}>
                              <Text>
                                {optionAdditional.name} - {optionAdditional.amount} -{' '}
                                {optionAdditional.priceFormated}
                              </Text>
                            </Box>
                          ))}
                      </Box>
                    </Box>
                  ))}
              </Box>
            </VStack>
          ))}

          <Text>{order.totalPriceFormated}</Text>
        </Box>
      </Flex>
    </Box>
  )
}

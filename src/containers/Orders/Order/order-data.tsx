import React, { Fragment } from 'react'
import {
  VStack,
  Heading,
  Flex,
  Text,
  Box,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  useBreakpointValue,
  AspectRatio,
} from '@chakra-ui/react'
import { FORMAT_ORDER_STATUS, FORMAT_PAYMENT, ORDER_STATUS_COLOR } from '../../../utils/dataFormat'
import { OrderFormated } from '../../../pages/orders/[oId]'

interface OrderDataProps {
  order: OrderFormated
}

export const OrderData = ({ order }: OrderDataProps) => {
  const isMobileView = useBreakpointValue({
    base: true,
    md: false,
    lg: false,
  })

  console.log(order)
  return (
    <VStack w="full" alignItems="flex-start">
      <Heading as="h3" fontWeight="normal" size="lg">
        Dados da ordem
      </Heading>

      <Flex>
        <Text mr="4">Forma de Pagamento:</Text>
        <Text>{FORMAT_PAYMENT[order.paymentMethod]}</Text>
      </Flex>
      <Flex>
        <Text mr="4">Status:</Text>
        <Text textColor={ORDER_STATUS_COLOR[order.status]}>
          {FORMAT_ORDER_STATUS[order.status]}
        </Text>
      </Flex>
      <Flex>
        <Text mr="4">Criada em:</Text>
        <Text>{order.dateFormated}</Text>
      </Flex>
      <Flex>
        <Text mr="4">Valor total da ordem:</Text>
        <Text>{order.totalPriceFormated}</Text>
      </Flex>

      <Box w="full">
        <Text mt="6" mb="2">
          Produtos:
        </Text>

        {order.orderProducts.map((orderProduct) => (
          <VStack key={orderProduct._id} w="full" px="4" mb="5" alignItems="flex-start">
            <Flex
              w="full"
              justifyContent="space-between"
              mb="2"
              flexDir={isMobileView ? 'column' : 'row'}
            >
              <Flex alignItems="center" mb={isMobileView ? '5' : '0'}>
                <AspectRatio ratio={4 / 3} w={'8rem'} mr="2">
                  <Image
                    objectFit="cover"
                    alt={orderProduct.product.name}
                    name={orderProduct.product.name}
                    src={
                      orderProduct.product?.imageUrl
                        ? orderProduct.product?.imageUrl
                        : '/images/default-picture.jpg'
                    }
                  />
                </AspectRatio>

                <Text fontWeight="bold" ml="2">
                  {orderProduct.product.name}
                </Text>
              </Flex>
              <Flex flexDir="column">
                <Flex>
                  <Text fontWeight="bold" mr="6" w="32">
                    Quantidade:
                  </Text>
                  <Text>{orderProduct.amount}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" mr="6" w="32">
                    Valor Unitário:
                  </Text>
                  <Text>{orderProduct.product.priceFormated}</Text>
                </Flex>
              </Flex>
            </Flex>

            <Box w="full">
              {orderProduct.pickedOptions && orderProduct.pickedOptions.length > 0 && (
                <Text mb="4">Opções escolhidas:</Text>
              )}
              {orderProduct.pickedOptions &&
                orderProduct.pickedOptions.map((pickedOption) => (
                  <Flex key={pickedOption._id} mb="12" flexDir={isMobileView ? 'column' : 'row'}>
                    <Text w="32">{pickedOption.productOptionName}:</Text>
                    <Table variant="simple" w="full">
                      <Thead>
                        <Tr>
                          <Th textAlign="center">Nome</Th>
                          <Th textAlign="center">Preço</Th>
                          <Th textAlign="center">Quantidade</Th>
                          <Th textAlign="center"> Vl. Total (R$)</Th>
                        </Tr>
                      </Thead>
                      {pickedOption.optionAdditionals &&
                        pickedOption.optionAdditionals.map((optionAdditional) => (
                          <Fragment key={optionAdditional._id}>
                            <Tbody>
                              <Tr>
                                <Td textAlign="center">{optionAdditional.name}</Td>
                                <Td textAlign="center">{optionAdditional.priceFormated}</Td>
                                <Td textAlign="center">{optionAdditional.amount}</Td>
                                <Td textAlign="center">
                                  {(
                                    optionAdditional.amount * Number(optionAdditional.price)
                                  ).toFixed(2)}
                                </Td>
                              </Tr>
                            </Tbody>
                          </Fragment>
                        ))}
                    </Table>
                  </Flex>
                ))}

              <Text textAlign="end">Valor total: {orderProduct.totalPriceFormated}</Text>
            </Box>

            <Divider />
          </VStack>
        ))}
      </Box>
    </VStack>
  )
}

import React, { Fragment } from 'react'
import Link from 'next/link'
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  ListItem,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  VStack,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react'
import { OrderContainerProps } from '../../pages/orders/[oId]'
import { Header } from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { FORMAT_ORDER_STATUS, FORMAT_PAYMENT, ORDER_STATUS_COLOR } from '../../utils/dataFormat'

export const OrderContainer = ({ order }: OrderContainerProps) => {
  // const { handleOpenAlertModal } = useAlertModal()
  // const { addToast } = useToast()
  const isMobileView = useBreakpointValue({
    base: true,
    md: false,
    lg: false,
  })

  return (
    <Box>
      <Header />

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

          <VStack w="full" alignItems="flex-start" mb="6">
            <Heading as="h3" fontWeight="normal" size="lg">
              Dados do cliente
            </Heading>
            <Flex
              alignItems={isMobileView ? 'flex-start' : 'center'}
              justifyContent={isMobileView ? 'flex-start' : 'space-between'}
              w="full"
              flexDir={isMobileView ? 'column' : 'row'}
            >
              <Flex mb={isMobileView ? '2' : '0'}>
                <Text mr="4">Nome:</Text>
                <Text>{order.client.name}</Text>
              </Flex>

              <Flex>
                <Text mr="4">Telefone para contato:</Text>
                <Text>{order.client.cellphone}</Text>
              </Flex>
            </Flex>
            <Flex>
              <Text mr="4">Email: </Text>
              <Text>{order.client.email}</Text>
            </Flex>

            <Flex flexDir="column">
              <Text mr="4" mb="2">
                Endereço de entrega:{' '}
              </Text>
              <UnorderedList marginLeft="8" spacing={2}>
                <ListItem>Estado: {order.deliveryAddress.state}</ListItem>
                <ListItem>Cidade: {order.deliveryAddress.city}</ListItem>
                <ListItem>Cep: {order.deliveryAddress.cep}</ListItem>
                <ListItem>Bairro: {order.deliveryAddress.neighborhood}</ListItem>
                <ListItem>Número: {order.deliveryAddress.number}</ListItem>
                <ListItem>Rua: {order.deliveryAddress.street}</ListItem>
              </UnorderedList>
            </Flex>
          </VStack>

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
                  <Flex w="full" justifyContent="space-between" mb="2">
                    <Flex alignItems="center">
                      <Image
                        src={orderProduct.product?.imageUrl}
                        alt={orderProduct.product.name}
                        boxSize="50px"
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/150"
                      />
                      <Text fontWeight="bold" ml="4">
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
                        <Flex
                          key={pickedOption._id}
                          mb="12"
                          flexDir={isMobileView ? 'column' : 'row'}
                        >
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
                                        {(optionAdditional.amount * optionAdditional.price).toFixed(
                                          2
                                        )}
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

          <Flex w="full" justifyContent="flex-end" alignCenter="center" mt="8">
            <Button
              as="a"
              size="sm"
              fontSize="sm"
              colorScheme="red"
              w="9rem"
              mr="6"
              cursor="pointer"
              h="12"
            >
              Cancelar pedido
            </Button>

            <Button
              as="a"
              size="sm"
              fontSize="sm"
              colorScheme="green"
              w="9rem"
              h="12"
              cursor="pointer"
            >
              Aceitar pedido
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

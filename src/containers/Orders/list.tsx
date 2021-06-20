import React, { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Spinner,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import Link from 'next/link'

import { Header } from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { Pagination } from '../../components/Pagination'
import { OrdersContainerProps } from '../../pages/orders'
import { listOrders } from '../../services/apiFunctions/companies/orders'
import { FORMAT_ORDER_STATUS, FORMAT_PAYMENT, ORDER_STATUS_COLOR } from '../../utils/dataFormat'

export const OrdersContainer = (props: OrdersContainerProps) => {
  const isMobileView = useBreakpointValue({
    base: true,
    md: false,
    lg: false,
  })

  const [page, setPage] = useState(1)

  const {
    data: { orders, total, next, previous },
    isLoading,
  } = useQuery(
    ['orders', { page }],
    async () => {
      const { results, total, next, previous } = await listOrders({ page })

      const formatterPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })

      const ordersFormated = results.map((order) => ({
        ...order,
        dateFormated: dayjs(order.created_at).format('DD/MM/YYYY'),
        totalPriceFormated: formatterPrice.format(Number(order.totalPrice)),
      }))

      return { orders: ordersFormated, total, next, previous }
    },
    {
      initialData: {
        orders: props.orders,
        previous: props.previous,
        next: props.next,
        total: props.total,
      },
    }
  )

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Ordens
            </Heading>
          </Flex>

          {isLoading ? (
            <Box textAlign="center">
              <Spinner size="xl" />
            </Box>
          ) : (
            <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th>Cliente</Th>
                  {!isMobileView && <Th textAlign="center">Qtd. Produtos</Th>}
                  <Th>Preço Total</Th>
                  {!isMobileView && (
                    <>
                      <Th>Forma de Pagamento</Th>
                      <Th>Criada Em</Th>
                    </>
                  )}
                  <Th>Status</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => (
                  <Tr key={order._id}>
                    <Td px="6">
                      <Text>{order.client ? order.client.name : 'Cliente inválido'}</Text>
                    </Td>
                    {!isMobileView && (
                      <Td px="6" textAlign="center">
                        <Text>{order.orderProducts.length}</Text>
                      </Td>
                    )}
                    <Td>
                      <Box>
                        <Text fontWeight="bold">{order.totalPriceFormated}</Text>
                      </Box>
                    </Td>
                    {!isMobileView && (
                      <>
                        <Td>
                          <Box>
                            <Text>{FORMAT_PAYMENT[order.paymentMethod]}</Text>
                          </Box>
                        </Td>
                        <Td>
                          <Text fontSize="sm">{order.dateFormated}</Text>
                        </Td>
                      </>
                    )}
                    <Td>
                      <Text fontSize="sm" textColor={ORDER_STATUS_COLOR[order.status]}>
                        {FORMAT_ORDER_STATUS[order.status]}
                      </Text>
                    </Td>
                    <Td>
                      <Link href={`/orders/${order._id}`} passHref>
                        <Button as="a" size="sm" fontSize="sm" colorScheme="purple">
                          Ver mais
                        </Button>
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}

          <Pagination currentPage={page} totalCountOfRegisters={total} onPageChange={setPage} />
        </Box>
      </Flex>
    </Box>
  )
}

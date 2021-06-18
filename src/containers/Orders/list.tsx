import React, { useState } from 'react'
import {
  Box,
  Button,
  Image,
  Flex,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { RiAddLine, RiPencilLine } from 'react-icons/ri'
import dayjs from 'dayjs'
import Link from 'next/link'

import { Header } from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { Pagination } from '../../components/Pagination'
import { useAlertModal } from '../../contexts/AlertModal'
import { useToast } from '../../contexts/Toast'
import { deleteProduct, getProducts } from '../../services/apiFunctions/companies/products'
import { queryClient } from '../../services/queryClient'
import { useCompanyAuth } from '../../contexts/AuthCompany'
import { OrdersContainerProps } from '../../pages/orders'
import { listOrders } from '../../services/apiFunctions/companies/orders'
import { FORMAT_ORDER_STATUS, FORMAT_PAYMENT } from '../../utils/dataFormat'

export const OrdersContainer = (props: OrdersContainerProps) => {
  const [page, setPage] = useState(1)

  const {
    data: { orders },
    isLoading,
  } = useQuery(
    ['orders', { page }],
    async () => {
      const orders = await listOrders({})

      const formatterPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })

      const ordersFormated = orders.map((order) => ({
        ...order,
        dateFormated: dayjs(order.created_at).format('DD/MM/YYYY'),
        totalPriceFormated: formatterPrice.format(Number(order.totalPrice)),
      }))

      return { orders: ordersFormated }
    },
    {
      initialData: {
        orders: props.orders,
      },
    }
  )

  const { handleOpenAlertModal } = useAlertModal()
  const { addToast } = useToast()

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
                  <Th>Qtd. Produtos</Th>
                  <Th>Preço Total</Th>
                  <Th>Forma de Pagamento</Th>
                  <Th>Criada Em</Th>
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
                    <Td px="6">
                      <Text>{order.orderProducts.length}</Text>
                    </Td>
                    <Td>
                      <Box>
                        <Text fontWeight="bold">{order.totalPriceFormated}</Text>
                      </Box>
                    </Td>
                    <Td>
                      <Box>
                        <Text>{FORMAT_PAYMENT[order.paymentMethod]}</Text>
                      </Box>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{order.dateFormated}</Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{FORMAT_ORDER_STATUS[order.status]}</Text>
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

          {/* <Pagination currentPage={page} totalCountOfRegisters={total} onPageChange={setPage} /> */}
        </Box>
      </Flex>
    </Box>
  )
}

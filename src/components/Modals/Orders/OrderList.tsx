import React from 'react'
import { Box, Text, Flex, Icon, Divider, HStack } from '@chakra-ui/react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { FORMAT_ORDER_STATUS, ORDER_STATUS_COLOR_SECONDARY } from '../../../utils/dataFormat'
import { OrderFormated } from '../../../services/apiFunctions/clients/orders/types'

interface OrderListProps {
  order: OrderFormated
  setSelectedOrder: React.Dispatch<React.SetStateAction<OrderFormated>>
}

export const OrderList = ({ order, setSelectedOrder }: OrderListProps) => {
  return (
    <Box
      w="full"
      display="flex"
      flexDir="column"
      boxShadow="base"
      cursor="pointer"
      _hover={{ bg: 'gray.50' }}
      px="4"
      onClick={() => setSelectedOrder(order)}
    >
      <Flex position="relative">
        <Flex flexDir="column" alignItems="flex-start" w="full" py="4">
          {order.orderProducts.map((orderProduct) => (
            <Flex key={orderProduct._id} fontSize="md" alignItems="center" mb="2" w="full">
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
                {orderProduct.amount}
              </Text>
              <Text textColor="gray.700">{orderProduct.product.name}</Text>
            </Flex>
          ))}
        </Flex>
        <Flex alignItems="center">
          <Icon as={MdKeyboardArrowRight} mr="4" />
        </Flex>
      </Flex>
      <Divider />
      <HStack
        textColor="gray.500"
        fontSize="sm"
        justifyContent="space-between"
        alignItems="center"
        my="2"
      >
        <Text textColor={ORDER_STATUS_COLOR_SECONDARY[order.status]}>
          {FORMAT_ORDER_STATUS[order.status]}
        </Text>
        <Text>{order.dateFormated}</Text>
      </HStack>
    </Box>
  )
}

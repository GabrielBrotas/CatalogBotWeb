import React, { Fragment, useState } from 'react'
import {
  VStack,
  Flex,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Box,
} from '@chakra-ui/react'
import { FiShoppingBag } from 'react-icons/fi'

import { useOrderModal } from '../../../contexts/Modals/OrderModal'
import { OrderList } from './OrderList'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { SingleOrder } from './SingleOrder'

export const OrderModal = () => {
  const { isOrderModalOpen, handleCloseOrderModal, orders, selectedOrder, setSelectedOrder } =
    useOrderModal()
  if (!orders) return <></>

  return (
    <Drawer placement="bottom" onClose={handleCloseOrderModal} isOpen={isOrderModalOpen}>
      <DrawerOverlay />
      <DrawerContent h="90%" borderTopRadius="2xl">
        <DrawerHeader borderBottomWidth="1px" w="full">
          <Flex alignItems="center" justifyContent="space-between">
            {!selectedOrder ? (
              <FiShoppingBag size={24} style={{ marginBottom: 2 }} />
            ) : (
              <AiOutlineArrowLeft
                size={24}
                style={{ marginBottom: 2 }}
                onClick={() => setSelectedOrder(null)}
                cursor="pointer"
              />
            )}

            <Text ml="2">Histórico de ordens</Text>

            <Box />
          </Flex>
        </DrawerHeader>
        <DrawerBody textColor="gray.800" overflowY="scroll">
          <VStack w="full" alignItems="flex-start" mb="8" spacing="4">
            {orders.results.length > 0 ? (
              !selectedOrder ? (
                orders.results.map((order) => (
                  <OrderList key={order._id} order={order} setSelectedOrder={setSelectedOrder} />
                ))
              ) : (
                <SingleOrder />
              )
            ) : (
              <Flex align="center" justifyContent="center" margin="auto">
                <Box textAlign="center">
                  <img
                    src="/svgs/not-found.svg"
                    alt="not found"
                    height="100%"
                    style={{
                      objectFit: 'cover',
                      margin: 'auto',
                    }}
                  />
                  <Text mt="6" fontSize="2xl" fontWeight="medium">
                    Nenhum pedido foi encontrado
                  </Text>
                </Box>
              </Flex>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

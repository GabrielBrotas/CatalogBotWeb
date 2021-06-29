import { HStack, Icon } from '@chakra-ui/react'
import React from 'react'
import { FiShoppingBag } from 'react-icons/fi'
import { useOrderModal } from '../../../contexts/Modals/OrderModal'

export function OrdersNav() {
  const { openOrderModal } = useOrderModal()

  return (
    <HStack mx="4" py="1" color="whiteAlpha.800" cursor="pointer" onClick={openOrderModal}>
      <Icon as={FiShoppingBag} fontSize="24" />
    </HStack>
  )
}

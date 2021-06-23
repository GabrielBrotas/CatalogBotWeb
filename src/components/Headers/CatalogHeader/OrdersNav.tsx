import { HStack, Icon } from '@chakra-ui/react'
import React from 'react'
import { RiShoppingBagLine } from 'react-icons/ri'

export function OrdersNav() {
  return (
    <HStack mx="4" py="1" color="whiteAlpha.800" cursor="pointer">
      <Icon as={RiShoppingBagLine} fontSize="24" />
    </HStack>
  )
}

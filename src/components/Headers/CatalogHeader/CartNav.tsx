import { HStack, Icon } from '@chakra-ui/react'
import React from 'react'
import { RiShoppingCart2Line } from 'react-icons/ri'

export function CartNav() {
  return (
    <HStack mx="6" py="1" color="whiteAlpha.800" cursor="pointer">
      <Icon as={RiShoppingCart2Line} fontSize="20" cursor="pointer" />
    </HStack>
  )
}

import { Box, HStack, Icon, Text } from '@chakra-ui/react'
import React from 'react'
import { RiShoppingCart2Line } from 'react-icons/ri'
import { useCart } from '../../../contexts/Cart'

export function CartNav() {
  const { cart, openCartModal } = useCart()

  return (
    <HStack
      mx="6"
      py="1"
      color="whiteAlpha.800"
      cursor="pointer"
      position="relative"
      onClick={openCartModal}
    >
      <Icon as={RiShoppingCart2Line} fontSize="24" cursor="pointer" />
      {cart && cart.orderProducts.length > 0 && (
        <Box
          bg="white"
          w="6"
          h="6"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="sm"
          borderRadius="full"
          position="absolute"
          top="-2"
          right="-4"
          textColor="#007aff"
          fontWeight="bold"
        >
          <Text p="0" m="0">
            {cart.orderProducts.length}
          </Text>
        </Box>
      )}
    </HStack>
  )
}

import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { useCart } from '../../../contexts/Cart'

export const FloatCart = () => {
  const { cart, setIsCartModalOpen } = useCart()

  if (!cart || cart.orderProducts.length === 0) return <></>

  return (
    <Flex
      position="absolute"
      bottom="0"
      as="section"
      w="100%"
      maxWidth={1480}
      mx="auto"
      bg="white"
      alignItems="center"
      justifyContent="center"
      textColor="gray.600"
      cursor="pointer"
      mt="auto"
      onClick={() => setIsCartModalOpen(true)}
    >
      <Text p="8">Ver carrinho ({cart.orderProducts.length})</Text>
    </Flex>
  )
}

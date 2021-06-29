import React from 'react'
import { Box, Container, Flex, Icon, Text } from '@chakra-ui/react'
import { useCart } from '../../../contexts/Cart'
import { FiShoppingBag } from 'react-icons/fi'

export const FloatCart = () => {
  const { cart, openCartModal } = useCart()

  if (!cart || cart.orderProducts.length === 0) return <></>

  return (
    <Container position="fixed" bottom="0" p="0" maxW={1480}>
      <Flex
        w="100%"
        maxWidth={800}
        mx="auto"
        bg="#007aff"
        alignItems="center"
        justifyContent="space-between"
        textColor="white"
        cursor="pointer"
        mt="auto"
        onClick={openCartModal}
        p="6"
      >
        <Box position="relative">
          <Icon as={FiShoppingBag} fontSize="28" cursor="pointer" />
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
              right="-3"
              textColor="#007aff"
              fontWeight="bold"
            >
              <Text>{cart.orderProducts.length}</Text>
            </Box>
          )}
        </Box>

        <Text fontSize="xl">Ver sacola</Text>
        <Text fontSize="xl">{cart.cartTotalPriceFormated}</Text>
      </Flex>
    </Container>
  )
}

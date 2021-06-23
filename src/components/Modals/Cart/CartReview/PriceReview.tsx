import React from 'react'
import { VStack, Text, Flex } from '@chakra-ui/react'

interface PriceReviewProps {
  subTotal: string
  deliveryPrice: string
  totalPrice: string
}

export const PriceReview = ({ deliveryPrice, subTotal, totalPrice }: PriceReviewProps) => {
  return (
    <VStack w="full" my="4">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        w="full"
        fontSize="lg"
        textColor="gray.600"
      >
        <Text>Subtotal</Text>
        <Text>{subTotal}</Text>
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        w="full"
        fontSize="lg"
        textColor="gray.600"
      >
        <Text>Taxa de entrega</Text>
        <Text>{deliveryPrice}</Text>
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        w="full"
        fontSize="2xl"
        fontWeight="semibold"
      >
        <Text>Total</Text>
        <Text>{totalPrice}</Text>
      </Flex>
    </VStack>
  )
}

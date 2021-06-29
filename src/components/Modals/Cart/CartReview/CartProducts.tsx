import { Box, Flex, Text, Image, HStack, Input } from '@chakra-ui/react'
import React from 'react'
import { AiOutlineLine, AiOutlinePlus } from 'react-icons/ai'
import { CartOrderProduct } from '../../../../services/apiFunctions/clients/cart/types'
import { currencyFormat } from '../../../../utils/dataFormat'

interface CartProductsProps {
  orderProducts: CartOrderProduct[]
  setCartOrderProducts: React.Dispatch<React.SetStateAction<CartOrderProduct[]>>
}

export const CartProducts = ({ orderProducts, setCartOrderProducts }: CartProductsProps) => {
  const increaseProductAmount = (productId: string) => {
    setCartOrderProducts(
      orderProducts.map((orderProduct) => ({
        ...orderProduct,
        amount:
          String(productId) === String(orderProduct._id)
            ? orderProduct.amount + 1
            : orderProduct.amount,
      }))
    )
  }

  const decreaseProductAmount = (productId: string) => {
    setCartOrderProducts(
      orderProducts.map((orderProduct) => ({
        ...orderProduct,
        amount:
          String(productId) === String(orderProduct._id)
            ? orderProduct.amount - 1
            : orderProduct.amount,
      }))
    )
  }
  return (
    <>
      {orderProducts.map((orderProduct) => (
        <Flex
          key={orderProduct._id}
          w="full"
          alignItems="flex-start"
          justifyContent="space-between"
          py="2"
          mb="4"
        >
          <Box display="flex" flexDir="column" h="full" minH="160px">
            <Text fontSize="2xl" fontWeight="medium" mb="2" flex="1">
              {orderProduct.product.name}
            </Text>

            {orderProduct.pickedOptions.map((pickedOption) =>
              pickedOption.optionAdditionals.map((optionAdditional) => (
                <Flex fontSize="md" alignItems="center" mb="1" key={optionAdditional._id}>
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
                    {optionAdditional.amount}
                  </Text>
                  <Text textColor="gray.700">{optionAdditional.name}</Text>
                </Flex>
              ))
            )}
            <Text fontSize="xl" fontWeight="medium" my="4">
              {currencyFormat(orderProduct.product.price * orderProduct.amount)}
            </Text>
          </Box>
          <Flex flexDir="column" alignItems="center" mt="2">
            <Image
              boxSize="100px"
              objectFit="contain"
              src={
                orderProduct.product.imageUrl
                  ? orderProduct.product.imageUrl
                  : '/images/default-picture.jpg'
              }
              alt={orderProduct.product.name}
            />

            <HStack border="1px" borderColor="gray.100" px="2" my="4">
              <AiOutlineLine
                size={20}
                color="#007aff"
                cursor="pointer"
                onClick={() => decreaseProductAmount(orderProduct._id)}
              />
              <Input
                value={orderProduct.amount}
                border="none"
                readOnly
                min={0}
                w="4rem"
                textAlign="center"
                fontSize="lg"
                textColor="gray.600"
              />
              <AiOutlinePlus
                size={20}
                color="#007aff"
                cursor="pointer"
                onClick={() => increaseProductAmount(orderProduct._id)}
              />
            </HStack>
          </Flex>
        </Flex>
      ))}
    </>
  )
}

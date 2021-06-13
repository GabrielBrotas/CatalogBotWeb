import { Box, Flex, ListItem, OrderedList, VStack, Text, Image } from '@chakra-ui/react'
import React from 'react'
import { CartOrderProduct } from '../../../../services/apiFunctions/clients/cart/types'

interface CartProductsProps {
  orderProducts: CartOrderProduct[]
}

export const CartProducts = ({ orderProducts }: CartProductsProps) => {
  return (
    <>
      {orderProducts.map((orderProduct) => (
        <Flex
          key={orderProduct._id}
          w="full"
          alignItems="center"
          justifyContent="space-between"
          py="2"
        >
          <Box>
            <Text fontSize="xl">{orderProduct.product.name}</Text>
            {orderProduct.pickedOptions.map((pickedOption) => (
              <VStack key={pickedOption._id} alignItems="flex-start">
                <Text fontSize="lg">{pickedOption.productOptionName}</Text>
                <OrderedList>
                  {pickedOption.optionAdditionals.map((optionAdditional) => (
                    <ListItem fontSize="md" key={optionAdditional._id}>
                      {optionAdditional.name} - {optionAdditional.amount}
                    </ListItem>
                  ))}
                </OrderedList>
              </VStack>
            ))}
          </Box>

          <Image
            boxSize="50px"
            objectFit="cover"
            src={
              orderProduct.product.imageUrl
                ? orderProduct.product.imageUrl
                : '/images/default-picture.jpg'
            }
            alt={orderProduct.product.name}
          />
        </Flex>
      ))}
    </>
  )
}

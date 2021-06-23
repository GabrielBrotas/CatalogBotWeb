import React, { useCallback } from 'react'

import { Box, Flex, Heading, Text, Image, useMediaQuery } from '@chakra-ui/react'

import { Product } from '../services/apiFunctions/companies/products/types'
import { useProductModal } from '../contexts/ProductModal'

interface CatalogProductProps {
  product: Product
}

export const CatalogProduct = ({ product }: CatalogProductProps) => {
  const { openProductModal } = useProductModal()
  const [isMin800, isMin600, isMin400] = useMediaQuery([
    '(min-width: 800px)',
    '(min-width: 600px)',
    '(min-width: 450px)',
  ])

  const handleOpenProductModal = useCallback(
    (product: Product) => {
      openProductModal({ product })
    },
    [openProductModal]
  )

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      my="4"
      cursor="pointer"
      onClick={() => handleOpenProductModal(product)}
      w="full"
      _hover={{ bg: '#f8fafb' }}
    >
      <Image
        boxSize="5rem"
        name={product.name}
        src={product.imageUrl ? product.imageUrl : '/images/default-picture.jpg'}
        mr="4"
      />

      <Box display="flex" flexDir="column" justifyContent="space-between" flex={1} h="5rem">
        <Heading as="h5" size="sm" isTruncated>
          {product.name}
        </Heading>
        {product.description && (
          <Text
            mt="1"
            w="full"
            isTruncated
            maxW={isMin800 ? '40rem' : isMin600 ? '30rem' : isMin400 ? '20rem' : '10rem'}
          >
            {product.description}
          </Text>
        )}
        <Text fontSize="lg">{product.priceFormated}</Text>
      </Box>
    </Flex>
  )
}

import React from 'react'
import { DrawerHeader, Image } from '@chakra-ui/react'

interface ProductModalHeaderProps {
  productName: string
  productImageUrl?: string
}

export const ProductModalHeader = ({ productName, productImageUrl }: ProductModalHeaderProps) => {
  return (
    <DrawerHeader borderBottomWidth="1px" w="full" display="flex" justifyContent="center">
      <Image
        boxSize="10rem"
        name={productName}
        src={productImageUrl ? productImageUrl : '/images/default-picture.jpg'}
      />
    </DrawerHeader>
  )
}

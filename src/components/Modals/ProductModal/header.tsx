import React from 'react'
import { AspectRatio, DrawerHeader, Image } from '@chakra-ui/react'

interface ProductModalHeaderProps {
  productName: string
  productImageUrl?: string
}

export const ProductModalHeader = ({ productName, productImageUrl }: ProductModalHeaderProps) => {
  return (
    <DrawerHeader borderBottomWidth="1px" w="full" display="flex" justifyContent="center">
      <AspectRatio ratio={4 / 3} w={'20rem'}>
        <Image
          objectFit="cover"
          name={productName}
          src={productImageUrl ? productImageUrl : '/images/default-picture.jpg'}
        />
      </AspectRatio>
    </DrawerHeader>
  )
}

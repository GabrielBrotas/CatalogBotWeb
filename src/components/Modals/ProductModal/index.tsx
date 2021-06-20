import React from 'react'
import { Drawer, DrawerContent, DrawerOverlay } from '@chakra-ui/react'
import { useProductModal } from '../../../contexts/ProductModal'
import { ProductModalBody } from './body'
import { ProductModalHeader } from './header'

export const ProductModal = () => {
  const { isProductModalOpen, handleCloseProductModal, activeProduct } = useProductModal()

  const onClose = () => handleCloseProductModal()

  if (!activeProduct) return <></>

  return (
    <>
      <Drawer placement="bottom" onClose={onClose} isOpen={isProductModalOpen}>
        <DrawerOverlay />
        <DrawerContent h="90%" borderTopRadius="2xl">
          <ProductModalHeader
            productName={activeProduct.name}
            productImageUrl={activeProduct.imageUrl}
          />

          <ProductModalBody activeProduct={activeProduct} />
        </DrawerContent>
      </Drawer>
    </>
  )
}

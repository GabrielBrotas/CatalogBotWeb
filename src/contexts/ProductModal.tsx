import { useDisclosure } from '@chakra-ui/react'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { Product } from '../services/apiFunctions/companies/products/types'

interface ProductModalProps {
  children: ReactNode
}

interface ProductModalContextProps {
  openProductModal(openModalProps: OpenModalProps): void
  isProductModalOpen: boolean
  handleCloseProductModal: () => void
  activeProduct: Product
}

const ProductModalContext = createContext({} as ProductModalContextProps)

type OpenModalProps = {
  product: Product
}

export function ProductModalProvider({ children }: ProductModalProps) {
  const [activeProduct, setActiveProduct] = useState<Product>()
  const { isOpen: isProductModalOpen, onOpen: onOpen, onClose: onClose } = useDisclosure()

  const openProductModal = useCallback(
    (props: OpenModalProps) => {
      setActiveProduct(props.product)
      onOpen()
    },
    [onOpen]
  )

  const handleCloseProductModal = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <ProductModalContext.Provider
      value={{
        openProductModal,
        isProductModalOpen,
        handleCloseProductModal,
        activeProduct,
      }}
    >
      {children}
    </ProductModalContext.Provider>
  )
}

export const useProductModal = () => useContext(ProductModalContext)

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

type ProductModal = {
  type: 'product'
  product: Product
}

type CartModal = {
  type: 'cart'
  orderProducts: string
}

type OpenModalProps = ProductModal | CartModal

export function ProductModalProvider({ children }: ProductModalProps) {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState<Product>()

  const openProductModal = useCallback((props: OpenModalProps) => {
    if (props.type === 'product') {
      setActiveProduct(props.product)
    }
    setIsProductModalOpen(true)
  }, [])

  const handleCloseProductModal = useCallback(() => {
    setIsProductModalOpen(false)
  }, [])

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

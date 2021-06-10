import { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { Product } from '../services/apiFunctions/products/types'

interface CatalogModalProps {
  children: ReactNode
}

interface CatalogModalContextProps {
  handleOpenCatalogModal(openModalProps: OpenModalProps): void
  isCatalogModalOpen: boolean
  handleCloseCatalogModal: () => void
  activeProduct: Product
}

const CatalogModalContext = createContext({} as CatalogModalContextProps)

type ProductModal = {
  type: 'product'
  product: Product
}

type CartModal = {
  type: 'cart'
  orderProducts: string
}

type OpenModalProps = ProductModal | CartModal

export function CatalogModalProvider({ children }: CatalogModalProps) {
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState<Product>()

  const handleOpenCatalogModal = useCallback((props: OpenModalProps) => {
    if (props.type === 'product') {
      setActiveProduct(props.product)
    }
    setIsCatalogModalOpen(true)
  }, [])

  const handleCloseCatalogModal = useCallback(() => {
    setIsCatalogModalOpen(false)
  }, [])

  return (
    <CatalogModalContext.Provider
      value={{
        handleOpenCatalogModal,
        isCatalogModalOpen,
        handleCloseCatalogModal,
        activeProduct,
      }}
    >
      {children}
    </CatalogModalContext.Provider>
  )
}

export const useCatalogModal = () => useContext(CatalogModalContext)

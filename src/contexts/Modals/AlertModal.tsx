import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

interface TostProviderProps {
  children: ReactNode
}

interface AlertModalContextProps {
  handleOpenAlertModal(openModalProps: OpenModalProps): void
  isAlertModalOpen: boolean
  handleCloseAlertModal: () => void
  alertModalContent: OpenModalProps
}

const AlertModalContext = createContext({} as AlertModalContextProps)

type OpenModalProps = {
  title: string
  description: string
  onConfirm: (data?: any) => void
  submitButtonText?: string
  showInput?: boolean
}

export function AlertModalProvider({ children }: TostProviderProps) {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)
  const [alertModalContent, setAlertModalContent] = useState<OpenModalProps>()

  const handleOpenAlertModal = useCallback(
    ({
      description,
      onConfirm,
      title,
      submitButtonText = 'Deletar',
      showInput = false,
    }: OpenModalProps) => {
      setAlertModalContent({ description, onConfirm, title, submitButtonText, showInput })
      setIsAlertModalOpen(true)
    },
    []
  )

  const handleCloseAlertModal = useCallback(() => {
    setIsAlertModalOpen(false)
  }, [])

  return (
    <AlertModalContext.Provider
      value={{ handleOpenAlertModal, isAlertModalOpen, handleCloseAlertModal, alertModalContent }}
    >
      {children}
    </AlertModalContext.Provider>
  )
}

export const useAlertModal = () => useContext(AlertModalContext)

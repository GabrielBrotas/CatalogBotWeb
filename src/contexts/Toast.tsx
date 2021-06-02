import { createContext, ReactNode, useCallback, useContext } from 'react'
import { useToast as useChakraToast, UseToastOptions } from '@chakra-ui/react'

interface TostProviderProps {
  children: ReactNode
}

type AddToastProps = {
  title: string
  description?: string
  status: 'success' | 'info' | 'warning' | 'error'
}

interface TostContextProps {
  addToast(options: AddToastProps): void
}

const SidebarDrawerContext = createContext({} as TostContextProps)

export function ToastProvider({ children }: TostProviderProps) {
  const toast = useChakraToast()

  const addToast = useCallback(({ title, description, status }: AddToastProps) => {
    toast({
      title,
      description,
      status,
      duration: 9000,
      isClosable: true,
    })
  }, [])
  return (
    <SidebarDrawerContext.Provider value={{ addToast }}>{children}</SidebarDrawerContext.Provider>
  )
}

export const useToast = () => useContext(SidebarDrawerContext)

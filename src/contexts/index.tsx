import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from 'react-query'

import { queryClient } from '../services/queryClient'
import { SidebarDrawerProvider } from '../contexts/Modals/SidebarDrawerContext'
import { ToastProvider } from '../contexts/Modals/Toast'
import { AuthCompanyProvider } from '../contexts/AuthCompany'
import { AuthClientProvider } from '../contexts/AuthClient'
import { AlertModalProvider } from '../contexts/Modals/AlertModal'
import { ProductModalProvider } from '../contexts/Modals/ProductModal'
import { OrderModalProvider } from '../contexts/Modals/OrderModal'

import { theme, ThemeProps } from '../styles/theme'

import { CartProvider } from '../contexts/Cart'

interface AppProviderProps {
  themeOptions: ThemeProps
}

export const AppProvider: React.FC<AppProviderProps> = ({ themeOptions, children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme(themeOptions)}>
        <ToastProvider>
          <AuthCompanyProvider>
            <AuthClientProvider>
              <CartProvider>
                <OrderModalProvider>
                  <ProductModalProvider>
                    <AlertModalProvider>
                      <SidebarDrawerProvider>{children}</SidebarDrawerProvider>
                    </AlertModalProvider>
                  </ProductModalProvider>
                </OrderModalProvider>
              </CartProvider>
            </AuthClientProvider>
          </AuthCompanyProvider>
        </ToastProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

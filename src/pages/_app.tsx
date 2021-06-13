import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from 'react-query'

import { queryClient } from '../services/queryClient'
import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext'
import { ToastProvider } from '../contexts/Toast'
import { AuthCompanyProvider } from '../contexts/AuthCompany'
import { AuthClientProvider } from '../contexts/AuthClient'
import { AlertModalProvider } from '../contexts/AlertModal'
import { CatalogModalProvider } from '../contexts/CatalogModal'
import { CartProvider } from '../contexts/Cart'

import { theme } from '../styles/theme'
import '../styles/global.css'

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthCompanyProvider>
          <AuthClientProvider>
            <ToastProvider>
              <CatalogModalProvider>
                <CartProvider>
                  <AlertModalProvider>
                    <SidebarDrawerProvider>
                      <Component {...pageProps} />
                    </SidebarDrawerProvider>
                  </AlertModalProvider>
                </CartProvider>
              </CatalogModalProvider>
            </ToastProvider>
          </AuthClientProvider>
        </AuthCompanyProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default MyApp

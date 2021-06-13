import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from 'react-query'

import { queryClient } from '../services/queryClient'
import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext'
import { ToastProvider } from '../contexts/Toast'
import { AuthCompanyProvider } from '../contexts/AuthCompany'
import { AuthClientProvider } from '../contexts/AuthClient'
import { AlertModalProvider } from '../contexts/AlertModal'
import { ProductModalProvider } from '../contexts/ProductModal'

import { theme } from '../styles/theme'
import '../styles/global.css'

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthCompanyProvider>
          <AuthClientProvider>
            <ToastProvider>
              <ProductModalProvider>
                <AlertModalProvider>
                  <SidebarDrawerProvider>
                    <Component {...pageProps} />
                  </SidebarDrawerProvider>
                </AlertModalProvider>
              </ProductModalProvider>
            </ToastProvider>
          </AuthClientProvider>
        </AuthCompanyProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default MyApp

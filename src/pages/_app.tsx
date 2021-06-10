import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'
import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext'
import { ToastProvider } from '../contexts/Toast'
import { AuthCompanyProvider } from '../contexts/AuthCompany'
import { AuthClientProvider } from '../contexts/AuthClient'
import { AlertModalProvider } from '../contexts/AlertModal'
import { QueryClientProvider } from 'react-query'
import { CatalogModalProvider } from '../contexts/CatalogModal'

import '../styles/global.css'
import { queryClient } from '../services/queryClient'

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CatalogModalProvider>
        <ChakraProvider theme={theme}>
          <ToastProvider>
            <AlertModalProvider>
              <AuthCompanyProvider>
                <AuthClientProvider>
                  <SidebarDrawerProvider>
                    <Component {...pageProps} />
                  </SidebarDrawerProvider>
                </AuthClientProvider>
              </AuthCompanyProvider>
            </AlertModalProvider>
          </ToastProvider>
        </ChakraProvider>
      </CatalogModalProvider>
    </QueryClientProvider>
  )
}

export default MyApp

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

import { theme, ThemeProps } from '../styles/theme'
import '../styles/global.css'

function handleGlobalStyles(pageProps) {
  const styles: ThemeProps = {}

  if (pageProps.globalStyles) {
    if (pageProps.globalStyles.bg) {
      styles.bg = pageProps.globalStyles.bg
    }

    if (pageProps.globalStyles.color) {
      styles.color = pageProps.globalStyles.color
    }
  }
  return styles
}

function MyApp({ Component, pageProps }) {
  const themeOptions = handleGlobalStyles(pageProps)

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme(themeOptions)}>
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

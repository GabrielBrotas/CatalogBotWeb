import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'
import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext'
import { ToastProvider } from '../contexts/Toast'
import { AuthCompanyProvider } from '../contexts/authCompany'
import { AlertModalProvider } from '../contexts/AlertModal'

import '../styles/global.css'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ToastProvider>
        <AlertModalProvider>
          <AuthCompanyProvider>
            <SidebarDrawerProvider>
              <Component {...pageProps} />
            </SidebarDrawerProvider>
          </AuthCompanyProvider>
        </AlertModalProvider>
      </ToastProvider>
    </ChakraProvider>
  )
}

export default MyApp

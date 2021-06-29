import React from 'react'
import { ThemeProps } from '../styles/theme'

import '../styles/global.css'
import { AppProvider } from '../contexts'

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
    <AppProvider themeOptions={themeOptions}>
      <Component {...pageProps} />
    </AppProvider>
  )
}

export default MyApp

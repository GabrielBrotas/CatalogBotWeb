import Head from 'next/head'
import React from 'react'
import { Company } from '../../services/apiFunctions/companies/company/types'

export type CatalogSEOProps = {
  company: Company
  page: string
}

export const AuthCompanySEO = ({ company, page }: CatalogSEOProps) => {
  const pageName = `${company.name} - ${page}`

  return (
    <Head>
      <title>{pageName}</title>
      <link rel="icon" href={company.mainImageUrl} />
      <meta property="og:title" content={pageName} key="ogtitle" />
      <meta property="og:description" content={pageName} key="ogdesc" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" key="twcard" />
      <meta name="twitter:creator" content={pageName} key="twhandle" />

      {/* Open Graph */}
      <meta property="og:image" content={company.mainImageUrl} key="ogimage" />
      <meta property="og:site_name" content={company.name} key="ogsitename" />
      <meta property="og:title" content={pageName} key="ogtitle" />
      <meta property="og:description" content={pageName} key="ogdesc" />
    </Head>
  )
}

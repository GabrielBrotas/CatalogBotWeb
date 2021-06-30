import Head from 'next/head'
import React from 'react'
import { Company } from '../../services/apiFunctions/companies/company/types'


export type CatalogSEOProps = {
  company: Company
  page: string
}
const CatalogSEO = ({ company, page }: CatalogSEOProps) => {
  const pageName = `${company.fantasyName} - ${page}`
  return (
    <Head>
      <title>{pageName}</title>
      <link rel="icon" href={company.iconUrl || company.logoUrl} />
      <meta property="og:title" content={pageName} key="ogtitle" />
      <meta property="og:description" content={pageName} key="ogdesc" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" key="twcard" />
      <meta name="twitter:creator" content={pageName} key="twhandle" />

      {/* Open Graph */}
      {/* <meta property="og:url" content={currentUrl} key="ogurl" /> */}
      <meta property="og:image" content={company.logoUrl} key="ogimage" />
      <meta property="og:site_name" content={company.fantasyName} key="ogsitename" />
      <meta property="og:title" content={pageName} key="ogtitle" />
      <meta property="og:description" content={pageName} key="ogdesc" />
    </Head>
  )
}

export default CatalogSEO

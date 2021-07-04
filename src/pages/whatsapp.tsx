import React from 'react'
import { withCompanySSRAuth } from '../utils/withSSRAuth'

import { useCompanyAuth } from '../contexts/AuthCompany'
import { AuthCompanySEO } from '../components/SEO/auth-company-seo'
import { WhatsAppContainer } from '../containers/Whatsapp'

export default function Whatsapp() {
  const { company } = useCompanyAuth()
  return (
    <>
      {company && <AuthCompanySEO company={company} page="Whatsapp" />}
      <WhatsAppContainer />
    </>
  )
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  return {
    props: {},
  }
})

import React from 'react'
import { AuthCompanySEO } from '../../components/SEO/auth-company-seo'
import { ProfileContainer } from '../../containers/Profile/Me'
import { getMyCompany } from '../../services/apiFunctions/companies/company'
import { Company } from '../../services/apiFunctions/companies/company/types'
import { withCompanySSRAuth } from '../../utils/withSSRAuth'

export interface ProfileProps {
  company: Company
}

export default function Profile({ company }) {
  return (
    <>
      {company && <AuthCompanySEO company={company} page="Perfil" />}
      <ProfileContainer company={company} />
    </>
  )
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    const company = await getMyCompany({ ctx })
    return {
      props: {
        company,
      },
    }
  } catch (err) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
})

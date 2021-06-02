import React from 'react'
import { ProfileContainer } from '../../containers/Profile/Me'
import { getMyCompany } from '../../services/apiFunctions/company'
import { Company } from '../../services/apiFunctions/company/types'
import { withSSRAuth } from '../../utils/withSSRAuth'

export interface ProfileProps {
  company: Company
}

export default function Profile({ company }) {
  return <ProfileContainer company={company} />
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
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

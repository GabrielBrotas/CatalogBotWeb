import React from 'react'
import { UpdateProfileContainer } from '../../containers/Profile/Update'
import { getMyCompany } from '../../services/apiFunctions/companies/company'
import { Company } from '../../services/apiFunctions/companies/company/types'
import { withCompanySSRAuth } from '../../utils/withSSRAuth'

export interface UpdateProfileProps {
  company: Company
}

export default function UpdateProfile({ company }: UpdateProfileProps) {
  return <UpdateProfileContainer company={company} />
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

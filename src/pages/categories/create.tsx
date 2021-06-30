import React from 'react'
import { AuthCompanySEO } from '../../components/SEO/auth-company-seo'

import { CreateCategoryContainer } from '../../containers/Categories/Create'
import { useCompanyAuth } from '../../contexts/AuthCompany'
import { withCompanySSRAuth } from '../../utils/withSSRAuth'

export default function CreateCategory() {
  const { company } = useCompanyAuth()
  return (
    <>
      {company && <AuthCompanySEO company={company} page="Categorias" />}
      <CreateCategoryContainer />
    </>
  )
}
export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    return {
      props: {},
    }
  } catch (err) {
    console.log(err)
    return {
      redirect: {
        destination: '/categories',
        permanent: false,
      },
    }
  }
})

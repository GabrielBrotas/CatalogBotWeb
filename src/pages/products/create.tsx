import React from 'react'
import { parseCookies } from 'nookies'
import jwtDecode from 'jwt-decode'

import { getCategories } from '../../services/apiFunctions/companies/categories'
import { Category } from '../../services/apiFunctions/companies/categories/types'
import { withCompanySSRAuth } from '../../utils/withSSRAuth'
import { useCompanyAuth } from '../../contexts/AuthCompany'
import { COOKIE_COMPANY_TOKEN } from '../../configs/constants'

import { CreateProductContainer } from '../../containers/Products/Create'
import { AuthCompanySEO } from '../../components/SEO/auth-company-seo'

export interface CreateProductProps {
  categories: Category[]
}

export default function CreateProduct({ categories }) {
  const { company } = useCompanyAuth()
  return (
    <>
      {company && <AuthCompanySEO company={company} page="Produtos" />}
      <CreateProductContainer categories={categories} />
    </>
  )
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    const cookies = parseCookies(ctx)
    const token = cookies[COOKIE_COMPANY_TOKEN]
    const { sub: companyId } = jwtDecode(token) as any

    const { results } = await getCategories({ ctx, limit: 999, companyId })

    return {
      props: {
        categories: results,
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

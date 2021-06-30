import React from 'react'
import { parseCookies } from 'nookies'
import jwtDecode from 'jwt-decode'

import { useCompanyAuth } from '../../../contexts/AuthCompany'
import { getCategories } from '../../../services/apiFunctions/companies/categories'
import { Category } from '../../../services/apiFunctions/companies/categories/types'
import { getProduct } from '../../../services/apiFunctions/companies/products'
import { Product } from '../../../services/apiFunctions/companies/products/types'
import { withCompanySSRAuth } from '../../../utils/withSSRAuth'
import { COOKIE_COMPANY_TOKEN } from '../../../configs/constants'

import { EditProductContainer } from '../../../containers/Products/Edit'
import { AuthCompanySEO } from '../../../components/SEO/auth-company-seo'

export interface EditProductProps {
  product: Product
  categories: Category[]
}

export default function EditProduct({ product, categories }: EditProductProps) {
  const { company } = useCompanyAuth()
  return (
    <>
      {company && <AuthCompanySEO company={company} page="Produtos" />}
      <EditProductContainer product={product} categories={categories} />
    </>
  )
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    const cookies = parseCookies(ctx)
    const token = cookies[COOKIE_COMPANY_TOKEN]
    const { sub: companyId } = jwtDecode(token) as any

    const { pId } = ctx.params

    const [product, categories] = await Promise.all([
      getProduct({ productId: pId as string, ctx }),
      getCategories({ ctx, companyId, limit: 999 }),
    ])

    return {
      props: {
        product,
        categories: categories.results,
      },
    }
  } catch (err) {
    console.log(err)
    return {
      redirect: {
        destination: '/products',
        permanent: false,
      },
    }
  }
})

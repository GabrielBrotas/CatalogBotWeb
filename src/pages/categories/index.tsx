import React from 'react'
import jwtDecode from 'jwt-decode'

import { CategoriesContainer } from '../../containers/Categories/List'
import { getCategories } from '../../services/apiFunctions/companies/categories'
import { Category } from '../../services/apiFunctions/companies/categories/types'
import { withCompanySSRAuth } from '../../utils/withSSRAuth'
import dayjs from 'dayjs'
import { AlertDialog } from '../../components/Modals/AlertDialog'
import { parseCookies } from 'nookies'
import { COOKIE_COMPANY_TOKEN } from '../../configs/constants'
import { Pagination } from '../../services/apiFunctions/companies/products/types'
import { AuthCompanySEO } from '../../components/SEO/auth-company-seo'
import { useCompanyAuth } from '../../contexts/AuthCompany'

interface CategoryFormated extends Category {
  dateFormated: string
}
export interface CategoriesProps extends Pagination {
  categories: CategoryFormated[]
}

export default function Categories({ categories, total, next, previous }: CategoriesProps) {
  const { company } = useCompanyAuth()
  return (
    <>
      {company && <AuthCompanySEO company={company} page="Categorias" />}
      <CategoriesContainer categories={categories} total={total} next={next} previous={previous} />
      <AlertDialog />
    </>
  )
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    const cookies = parseCookies(ctx)
    const token = cookies[COOKIE_COMPANY_TOKEN]
    const { sub: companyId } = jwtDecode(token) as any

    const { results, total, next, previous } = await getCategories({ ctx, companyId: companyId })

    const categoriesFormated = results.map((category) => ({
      ...category,
      dateFormated: dayjs(category.created_at).format('DD/MM/YYYY'),
    }))

    return {
      props: {
        categories: categoriesFormated,
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

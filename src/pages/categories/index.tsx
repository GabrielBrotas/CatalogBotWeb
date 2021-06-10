import React from 'react'
import jwtDecode from 'jwt-decode'

import { CategoriesContainer } from '../../containers/Categories/List'
import { getCategories } from '../../services/apiFunctions/categories'
import { Category, Pagination } from '../../services/apiFunctions/categories/types'
import { withCompanySSRAuth } from '../../utils/withSSRAuth'
import dayjs from 'dayjs'
import { AlertDialog } from '../../components/Modals/AlertDialog'
import { parseCookies } from 'nookies'

interface CategoryFormated extends Category {
  dateFormated: string
}
export interface CategoriesProps extends Pagination {
  categories: CategoryFormated[]
}

export default function Categories({ categories, total, next, previous }: CategoriesProps) {
  return (
    <>
      <CategoriesContainer categories={categories} total={total} next={next} previous={previous} />
      <AlertDialog />
    </>
  )
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    const cookies = parseCookies(ctx)
    const token = cookies['@CatalogBot.token']
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

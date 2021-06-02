import React from 'react'

import { CategoriesContainer } from '../../containers/Categories/List'
import { getMyCategories } from '../../services/apiFunctions/categories'
import { Category } from '../../services/apiFunctions/categories/types'
import { withSSRAuth } from '../../utils/withSSRAuth'
import dayjs from 'dayjs'
import { AlertDialog } from '../../components/AlertDialog'

interface CategoryFormated extends Category {
  dateFormated: string
}
export interface CategoriesProps {
  categories: CategoryFormated[]
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <>
      <CategoriesContainer categories={categories} />
      <AlertDialog />
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  try {
    const categories = await getMyCategories(ctx)

    const categoriesFormated = categories.map((category) => ({
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

import React from 'react'
import { EditCategoryContainer } from '../../../containers/Categories/Edit'
import { getCategory } from '../../../services/apiFunctions/categories'
import { Category } from '../../../services/apiFunctions/categories/types'
import { withCompanySSRAuth } from '../../../utils/withSSRAuth'

export interface EditCategoryProps {
  category: Category
}

export default function EditCategory({ category }: EditCategoryProps) {
  return <EditCategoryContainer category={category} />
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    const { cId } = ctx.params

    const category = await getCategory({ categoryId: cId as string, ctx })

    return {
      props: {
        category,
      },
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

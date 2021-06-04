import React from 'react'
import { CreateProductContainer } from '../../containers/Products/Create'
import { getMyCategories } from '../../services/apiFunctions/categories'
import { Category } from '../../services/apiFunctions/categories/types'
import { withSSRAuth } from '../../utils/withSSRAuth'

export interface CreateProductProps {
  categories: Category[]
}

export default function CreateProduct({ categories }) {
  return <CreateProductContainer categories={categories} />
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  try {
    const categories = await getMyCategories(ctx)

    return {
      props: {
        categories,
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

import { parseCookies } from 'nookies'
import jwtDecode from 'jwt-decode'
import React from 'react'
import { CreateProductContainer } from '../../containers/Products/Create'
import { getCategories } from '../../services/apiFunctions/categories'
import { Category } from '../../services/apiFunctions/categories/types'
import { withCompanySSRAuth } from '../../utils/withSSRAuth'

export interface CreateProductProps {
  categories: Category[]
}

export default function CreateProduct({ categories }) {
  return <CreateProductContainer categories={categories} />
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    const cookies = parseCookies(ctx)
    const token = cookies['@CatalogBot.token']
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

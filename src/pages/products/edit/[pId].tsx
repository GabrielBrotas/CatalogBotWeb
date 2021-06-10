import React from 'react'
import { parseCookies } from 'nookies'
import jwtDecode from 'jwt-decode'

import { EditProductContainer } from '../../../containers/Products/Edit'
import { getCategories } from '../../../services/apiFunctions/categories'
import { Category } from '../../../services/apiFunctions/categories/types'
import { getProduct } from '../../../services/apiFunctions/products'
import { Product } from '../../../services/apiFunctions/products/types'
import { withCompanySSRAuth } from '../../../utils/withSSRAuth'

export interface EditProductProps {
  product: Product
  categories: Category[]
}

export default function EditProduct({ product, categories }: EditProductProps) {
  return <EditProductContainer product={product} categories={categories} />
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    const cookies = parseCookies(ctx)
    const token = cookies['@CatalogBot.token']
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

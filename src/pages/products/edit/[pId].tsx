import React from 'react'
import { EditProductContainer } from '../../../containers/Products/Edit'
import { getMyCategories } from '../../../services/apiFunctions/categories'
import { Category } from '../../../services/apiFunctions/categories/types'
import { getProduct } from '../../../services/apiFunctions/products'
import { Product } from '../../../services/apiFunctions/products/types'
import { withSSRAuth } from '../../../utils/withSSRAuth'

export interface EditProductProps {
  product: Product
  categories: Category[]
}

export default function EditProduct({ product, categories }: EditProductProps) {
  return <EditProductContainer product={product} categories={categories} />
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  try {
    const { pId } = ctx.params

    const [product, categories] = await Promise.all([
      getProduct({ productId: pId as string, ctx }),
      getMyCategories(ctx),
    ])
    return {
      props: {
        product,
        categories,
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

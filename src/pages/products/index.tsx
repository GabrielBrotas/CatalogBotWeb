import dayjs from 'dayjs'
import React from 'react'
import { AlertDialog } from '../../components/AlertDialog'
import { ProductsContainer } from '../../containers/Products/List'
import { getMyProducts } from '../../services/apiFunctions/products'
import { Product } from '../../services/apiFunctions/products/types'
import { withSSRAuth } from '../../utils/withSSRAuth'

interface ProductFormated extends Product {
  dateFormated: string
  priceFormated: string
}
export interface ProductsProps {
  products: ProductFormated[]
}

export default function Products({ products }: ProductsProps) {
  return (
    <>
      <ProductsContainer products={products} />
      <AlertDialog />
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  try {
    const products = await getMyProducts(ctx)

    const formatterPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    const productsFormated = products.map((product) => ({
      ...product,
      dateFormated: dayjs(product.created_at).format('DD/MM/YYYY'),
      priceFormated: formatterPrice.format(product.price),
    }))

    return {
      props: {
        products: productsFormated,
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

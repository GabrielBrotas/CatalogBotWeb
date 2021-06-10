import dayjs from 'dayjs'
import React from 'react'
import jwt_decode from 'jwt-decode'
import { AlertDialog } from '../../components/Modals/AlertDialog'
import { ProductsContainer } from '../../containers/Products/List'
import { getProducts } from '../../services/apiFunctions/products'
import { Pagination, Product } from '../../services/apiFunctions/products/types'
import { withCompanySSRAuth } from '../../utils/withSSRAuth'
import { parseCookies } from 'nookies'

interface ProductFormated extends Product {
  dateFormated: string
  priceFormated: string
}
export interface ProductsProps extends Pagination {
  products: ProductFormated[]
}

export default function Products({ products, previous, total, next }: ProductsProps) {
  return (
    <>
      <ProductsContainer products={products} previous={previous} total={total} next={next} />
      <AlertDialog />
    </>
  )
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    const cookies = parseCookies(ctx)
    const token = cookies['@CatalogBot.token']
    const { sub: companyId } = jwt_decode(token) as any

    const { results, total, next, previous } = await getProducts({ ctx, companyId })

    const formatterPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    const productsFormated = results.map((product) => ({
      ...product,
      dateFormated: dayjs(product.created_at).format('DD/MM/YYYY'),
      priceFormated: formatterPrice.format(product.price),
    }))

    return {
      props: {
        products: productsFormated,
        total,
        next: next || null,
        previous: previous || null,
      },
    }
  } catch (err) {
    console.log(err)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
})

import React from 'react'
import dayjs from 'dayjs'

import { listOrders } from '../../services/apiFunctions/companies/orders'
import { Order } from '../../services/apiFunctions/companies/orders/types'
import { Pagination } from '../../services/apiFunctions/companies/products/types'
import { useCompanyAuth } from '../../contexts/AuthCompany'
import { withCompanySSRAuth } from '../../utils/withSSRAuth'

import { OrdersContainer } from '../../containers/Orders/list'
import { AuthCompanySEO } from '../../components/SEO/auth-company-seo'

interface OrderFormated extends Order {
  dateFormated: string
  totalPriceFormated: string
}

export interface OrdersContainerProps extends Pagination {
  orders: OrderFormated[]
}

export default function Orders({ orders, total, next, previous }: OrdersContainerProps) {
  const { company } = useCompanyAuth()
  return (
    <>
      {company && <AuthCompanySEO company={company} page="Ordens" />}
      <OrdersContainer orders={orders} total={total} next={next} previous={previous} />
    </>
  )
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    const { results, total, next, previous } = await listOrders({ ctx })

    const formatterPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    const ordersFormated = results.map((order) => ({
      ...order,
      dateFormated: dayjs(order.created_at).format('DD/MM/YYYY'),
      totalPriceFormated: formatterPrice.format(Number(order.totalPrice)),
    }))

    return {
      props: {
        orders: ordersFormated,
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

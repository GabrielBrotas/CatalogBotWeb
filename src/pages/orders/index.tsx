import React from 'react'
import dayjs from 'dayjs'
import { withCompanySSRAuth } from '../../utils/withSSRAuth'
import { listOrders } from '../../services/apiFunctions/companies/orders'
import { Order } from '../../services/apiFunctions/companies/orders/types'
import { OrdersContainer } from '../../containers/Orders/list'

interface OrderFormated extends Order {
  dateFormated: string
  totalPriceFormated: string
}

export interface OrdersContainerProps {
  orders: OrderFormated[]
}

export default function Orders({ orders }: OrdersContainerProps) {
  return (
    <>
      <OrdersContainer orders={orders} />
    </>
  )
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    const orders = await listOrders({ ctx })

    const formatterPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    const ordersFormated = orders.map((order) => ({
      ...order,
      dateFormated: dayjs(order.created_at).format('DD/MM/YYYY'),
      totalPriceFormated: formatterPrice.format(Number(order.totalPrice)),
    }))

    return {
      props: {
        orders: ordersFormated,
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

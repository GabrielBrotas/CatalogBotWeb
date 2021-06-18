import React from 'react'
import { GetServerSideProps } from 'next'
import { withCompanySSRAuth } from '../../utils/withSSRAuth'
import { getOrder } from '../../services/apiFunctions/companies/orders'
import { Section } from '../../components/Section'
import { Order } from '../../services/apiFunctions/companies/orders/types'
import { OrderContainer } from '../../containers/Orders/order'

export interface OrderContainerProps {
  order: Order
}

export default function OrderPage({ order }: OrderContainerProps) {
  return (
    <Section>
      <OrderContainer order={order} />
    </Section>
  )
}

export const getServerSideProps: GetServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    const { oId } = ctx.params

    const order = await getOrder({ orderId: String(oId), ctx })

    const formatterPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    if (!order) {
      return {
        redirect: {
          destination: '/orders',
          permanent: false,
        },
      }
    }

    const orderFormated = {
      ...order,
      totalPriceFormated: formatterPrice.format(Number(order.totalPrice)),
      orderProducts: order.orderProducts.map((orderProduct) => ({
        ...orderProduct,
        product: {
          ...orderProduct.product,
          priceFormated: formatterPrice.format(orderProduct.product.price),
        },
        pickedOptions: orderProduct.pickedOptions.map((pickedOption) => ({
          ...pickedOption,
          optionAdditionals: pickedOption.optionAdditionals.map((optionAdditional) => ({
            ...optionAdditional,
            priceFormated: formatterPrice.format(optionAdditional.price),
          })),
        })),
      })),
    }

    return {
      props: {
        order: orderFormated,
      },
    }
  } catch (err) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }
})

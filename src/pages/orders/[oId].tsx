import React from 'react'
import { GetServerSideProps } from 'next'
import { withCompanySSRAuth } from '../../utils/withSSRAuth'
import { getOrder } from '../../services/apiFunctions/companies/orders'
import { Section } from '../../components/Section'
import { Order } from '../../services/apiFunctions/companies/orders/types'
import { OrderContainer } from '../../containers/Orders/Order'
import dayjs from 'dayjs'
import { getTotalPriceFromOrderProduct } from '../../utils/maths'
import { AlertDialog } from '../../components/Modals/AlertDialog'
import { useCompanyAuth } from '../../contexts/AuthCompany'
import { AuthCompanySEO } from '../../components/SEO/auth-company-seo'

export interface OrderFormated extends Order {
  dateFormated: string
  totalPriceFormated: string
}
export interface OrderContainerProps {
  order: OrderFormated
}

export default function OrderPage({ order }: OrderContainerProps) {
  const { company } = useCompanyAuth()
  return (
    <>
      {company && <AuthCompanySEO company={company} page="Ordens" />}

      <Section>
        <OrderContainer order={order} />
        <AlertDialog />
      </Section>
    </>
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
      dateFormated: dayjs(order.created_at).format('DD/MM/YYYY - HH:mm'),
      totalPriceFormated: formatterPrice.format(Number(order.totalPrice)),
      orderProducts: order.orderProducts.map((orderProduct) => ({
        ...orderProduct,
        totalPriceFormated: formatterPrice.format(getTotalPriceFromOrderProduct(orderProduct)),
        product: {
          ...orderProduct.product,
          priceFormated: formatterPrice.format(orderProduct.product.price),
        },
        pickedOptions: orderProduct.pickedOptions.map((pickedOption) => ({
          ...pickedOption,
          optionAdditionals: pickedOption.optionAdditionals.map((optionAdditional) => ({
            ...optionAdditional,
            priceFormated: formatterPrice.format(Number(optionAdditional.price)),
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

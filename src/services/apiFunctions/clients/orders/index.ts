import { apiClient, apiClientSSR } from '../../../api'
import { RequestFromSSR } from '../../companies/company/types'
import { ICreateOrderDTO, Order } from './types'

export const createOrder = async ({
  companyId,
  orderProducts,
  deliveryAddress,
  paymentMethod,
  totalPrice,
  comment,
}: ICreateOrderDTO): Promise<Order> => {
  return await apiClient
    .post(`/orders/company/${companyId}`, {
      orderProducts,
      deliveryAddress,
      paymentMethod,
      totalPrice,
      comment,
    })
    .then(({ data }) => data)
}

export const listOrders = async ({ ctx = false }: RequestFromSSR): Promise<Order[]> => {
  if (!ctx) return await apiClient.get('/orders').then(({ data }) => data)
  return apiClientSSR(ctx)
    .get('/orders')
    .then(({ data }) => data)
}

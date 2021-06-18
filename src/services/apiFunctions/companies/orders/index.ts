import { apiCompany, apiCompanySSR } from '../../../api'
import { RequestFromSSR } from '../../companies/company/types'
import { IGetOrderDTO, Order } from './types'

export const listOrders = async ({ ctx = false }: RequestFromSSR): Promise<Order[]> => {
  if (!ctx) return await apiCompany.get('/orders').then(({ data }) => data)
  return apiCompanySSR(ctx)
    .get('/orders')
    .then(({ data }) => data)
}

export const getOrder = async ({ orderId, ctx }: IGetOrderDTO): Promise<Order> => {
  if (!ctx) return await apiCompany.get(`/orders/${orderId}`).then(({ data }) => data)
  return apiCompanySSR(ctx)
    .get(`/orders/${orderId}`)
    .then(({ data }) => data)
}

import { apiCompany, apiCompanySSR } from '../../../api'
import { IGetOrderDTO, IGetOrdersDTO, IUpdateOrderDTO, Order, OrderPaginated } from './types'

export const listOrders = async ({
  page = 1,
  limit = 10,
  ctx = false,
}: IGetOrdersDTO): Promise<OrderPaginated> => {
  if (!ctx)
    return await apiCompany.get(`/orders?page=${page}&limit=${limit}`).then(({ data }) => data)
  return apiCompanySSR(ctx)
    .get(`/orders?page=${page}&limit=${limit}`)
    .then(({ data }) => data)
}

export const getOrder = async ({ orderId, ctx }: IGetOrderDTO): Promise<Order> => {
  if (!ctx) return await apiCompany.get(`/orders/${orderId}`).then(({ data }) => data)
  return apiCompanySSR(ctx)
    .get(`/orders/${orderId}`)
    .then(({ data }) => data)
}

export const updateOrder = async ({ orderId, data }: IUpdateOrderDTO): Promise<Order> => {
  return await apiCompany.put(`/orders/${orderId}`, { order: { ...data } }).then(({ data }) => data)
}

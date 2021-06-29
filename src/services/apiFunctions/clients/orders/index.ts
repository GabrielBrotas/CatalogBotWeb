import { apiClient, apiClientSSR } from '../../../api'
import { Order } from '../../companies/orders/types'
import { ICreateOrderDTO, IGetMyOrdersDTO, IPaginatedOrders, IUpdateOrderDTO } from './types'

export const createOrder = async ({
  companyId,
  orderProducts,
  deliveryAddress,
  paymentMethod,
  totalPrice,
  comment,
  saveAddressAsDefault = true,
}: ICreateOrderDTO): Promise<Order> => {
  return await apiClient
    .post(`/orders/company/${companyId}`, {
      orderProducts,
      deliveryAddress,
      paymentMethod,
      totalPrice,
      comment,
      saveAddressAsDefault,
    })
    .then(({ data }) => data)
}

export const getMyOrders = async ({
  companyId,
  ctx = false,
}: IGetMyOrdersDTO): Promise<IPaginatedOrders> => {
  if (!ctx)
    return await apiClient.get(`/orders/client/company/${companyId}`).then(({ data }) => data)
  return apiClientSSR(ctx)
    .get(`/orders/client/company/${companyId}`)
    .then(({ data }) => data)
}

export const updateOrder = async ({ orderId, data }: IUpdateOrderDTO): Promise<Order> => {
  return await apiClient.put(`/orders/${orderId}`, { order: { ...data } }).then(({ data }) => data)
}

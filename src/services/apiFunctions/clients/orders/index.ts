import { apiClient } from '../../../api'
import { Order } from '../../companies/orders/types'
import { ICreateOrderDTO } from './types'

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

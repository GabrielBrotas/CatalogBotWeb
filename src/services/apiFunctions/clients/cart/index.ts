import { apiClient, apiClientSSR } from '../../../api'
import { AddProductToCartDTO, Cart, ClearCartDTO, GetCartDTO, UpdateCartDTO } from './types'

export const getCart = async ({ companyId, ctx = false }: GetCartDTO): Promise<Cart> => {
  if (!ctx) return await apiClient.get(`/orders/cart/company/${companyId}`).then(({ data }) => data)
  return apiClientSSR(ctx)
    .get(`/orders/cart/company/${companyId}`)
    .then(({ data }) => data)
}

export const addProductInCart = async ({
  companyId,
  orderProduct,
}: AddProductToCartDTO): Promise<Cart> => {
  return await apiClient
    .post(`/orders/cart/company/${companyId}`, { orderProduct })
    .then(({ data }) => data)
}

export const updateCart = async ({ cartId, orderProducts }: UpdateCartDTO): Promise<Cart> => {
  return await apiClient.put(`/orders/cart/${cartId}`, { orderProducts }).then(({ data }) => data)
}

export const clearCart = async ({ cartId }: ClearCartDTO): Promise<void> => {
  return await apiClient.delete(`/orders/cart/${cartId}`).then(({ data }) => data)
}

import { OrderProduct } from './../orders/types'

export type Cart = {
  _id: string
  clientId: string
  companyId: string
  orderProducts: OrderProduct[]
  created_at: Date
}

export type AddProductToCartDTO = {
  companyId: string
  orderProduct: OrderProduct
}

export type GetCartDTO = {
  companyId: string
  ctx?: any
}

export type UpdateCartDTO = {
  cartId: string
  orderProducts: OrderProduct[]
}

export type ClearCartDTO = {
  cartId: string
}

import { Product } from '../../companies/products/types'
import { OrderProduct, PickedOptions } from './../orders/types'

export type CartOrderProduct = {
  _id?: string
  product: Product
  amount: number
  pickedOptions: PickedOptions[]
  comment?: string
}

export type Cart = {
  _id: string
  clientId: string
  companyId: string
  orderProducts: CartOrderProduct[]
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

import { Product } from '../../companies/products/types'
import { PickedOptions } from './../orders/types'

export type CartOrderProduct = {
  _id?: string
  product: Product
  amount: number
  pickedOptions: PickedOptions[]
  comment?: string
  TotalPrice: number
  TotalPriceFormated: string
}

export type Cart = {
  _id: string
  clientId: string
  companyId: string
  orderProducts: CartOrderProduct[]
  created_at: Date
}

export type StoreCartOrderProductDTO = {
  _id?: string
  product: string
  amount: number
  pickedOptions: PickedOptions[]
  comment?: string
}

export type AddProductToCartDTO = {
  companyId: string
  orderProduct: StoreCartOrderProductDTO
}

export type GetCartDTO = {
  companyId: string
  ctx?: any
}

export type UpdateCartDTO = {
  cartId: string
  orderProducts: StoreCartOrderProductDTO[]
}

export type ClearCartDTO = {
  cartId: string
}

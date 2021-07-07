import { Pagination } from '../products/types'
import { Address, Client } from './../../clients/client/types'

type OrderOptionsAdditionals = {
  _id?: string
  name: string
  price: number | string
  amount: number
  priceFormated?: string
}

export type PickedOptions = {
  _id?: string
  productOptionName: string
  optionAdditionals: OrderOptionsAdditionals[]
}

export type OrderProduct = {
  _id?: string
  product: {
    _id: string
    name: string
    price: number
    imageUrl: string
    priceFormated?: string
  }
  amount: number
  pickedOptions: PickedOptions[]
  comment?: string
  totalPriceFormated?: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'sent' | 'received' | 'canceled'

export type PaymentMethods = 'boleto' | 'creditCard' | 'debit' | 'pix' | 'money'

export type Order = {
  _id: string
  client: Client
  company: string
  orderProducts: OrderProduct[]
  totalPrice: string
  totalPriceFormated?: string
  paymentMethod: PaymentMethods
  deliveryAddress: Address
  status: OrderStatus
  created_at: Date
}

export interface OrderPaginated extends Pagination {
  results: Order[]
}

export type IGetOrderDTO = {
  orderId: string
  ctx?: any
}

export type IGetOrdersDTO = {
  page?: number
  limit?: number
  ctx?: any
}

export type IOrderToUpdateDTO = {
  orderProducts: OrderProduct[]
  totalPrice: string
  paymentMethod: PaymentMethods
  deliveryAddress: Address
  status: OrderStatus
}

export type IUpdateOrderDTO = {
  orderId: string
  data: IOrderToUpdateDTO
}

import { Company } from '../company/types'
import { Address, Client } from './../../clients/client/types'

type OrderOptionsAdditionals = {
  _id?: string
  name: string
  price: number
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
}

export type OrderStatus = 'pending' | 'confimed' | 'sent' | 'received' | 'canceled'

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

export type IGetOrderDTO = {
  orderId: string
  ctx?: any
}
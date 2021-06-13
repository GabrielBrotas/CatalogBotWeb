import { Address } from '../client/types'

type OrderOptionsAdditionals = {
  _id?: string
  name: string
  price: number
  amount: number
}

export type PickedOptions = {
  _id?: string
  productOptionName: string
  optionAdditionals: OrderOptionsAdditionals[]
}

export type OrderProduct = {
  _id?: string
  product: string
  amount: number
  pickedOptions: PickedOptions[]
  comment?: string
}

export type OrderStatus = 'pending' | 'confimed' | 'sent' | 'received' | 'canceled'

export type PaymentMethods = 'boleto' | 'creditCard' | 'debit' | 'pix' | 'money'

export type ICreateOrderDTO = {
  companyId: string
  orderProducts: OrderProduct[]
  totalPrice: number
  comment?: string
  deliveryAddress: Address
  paymentMethod: PaymentMethods
}

export type Order = {
  _id: string
  clientId: string
  companyId: string
  orderProducts: OrderProduct[]
  totalPrice: string
  paymentMethod: PaymentMethods
  deliveryAddress: Address
  status: OrderStatus
  created_at: Date
}
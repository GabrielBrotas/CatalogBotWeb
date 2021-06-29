import { Order } from '../../companies/orders/types'
import { Pagination } from '../../companies/products/types'
import { Address } from '../client/types'

type OrderOptionsAdditionals = {
  _id?: string
  name: string
  price: number | string
  amount: number
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
    price: number | string
    imageUrl: string
  }
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
  saveAddressAsDefault?: boolean
}

export type IGetMyOrdersDTO = {
  companyId: string
  ctx?: any
}

export interface OrderFormated extends Order {
  dateFormated: string
  totalPriceFormated: string
}

export interface IPaginatedOrders extends Pagination {
  results: OrderFormated[]
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

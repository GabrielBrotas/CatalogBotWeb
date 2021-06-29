import { Pagination } from '../../companies/products/types'

export type IGetNotificationsDTO = {
  ctx?: any
  Sender: string
}

export type IUpdateNotificationsDTO = {
  notificationsId: Array<string>
}

export interface Notification {
  _id: string
  Viewed: boolean
  Receiver: string
  Sender: string
  Order?: string
  Text: string
  Type: 'order'
  CreatedAt: string
  UpdatedAt: string
}

export interface IPaginatedNotifications extends Pagination {
  results: Notification[]
}

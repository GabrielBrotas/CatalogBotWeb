import { apiClient, apiClientSSR } from '../../../api'
import { IGetNotificationsDTO, IPaginatedNotifications, IUpdateNotificationsDTO } from './types'

export const getClientNotifications = async ({
  Sender,
  ctx = false,
}: IGetNotificationsDTO): Promise<IPaginatedNotifications> => {
  if (!Sender) return
  if (!ctx) return await apiClient.get(`/notifications?Sender=${Sender}`).then(({ data }) => data)
  return apiClientSSR(ctx)
    .get(`/notifications?Sender=${Sender}`)
    .then(({ data }) => data)
}

export const updateClientNotifications = async ({
  notificationsId,
}: IUpdateNotificationsDTO): Promise<void> => {
  return await apiClient.put(`/notifications`, { notificationsId }).then(({ data }) => data)
}

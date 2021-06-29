import { apiCompany, apiCompanySSR } from '../../../api'
import { IGetNotificationsDTO, IPaginatedNotifications, IUpdateNotificationsDTO } from './types'

export const getCompanyNotifications = async ({
  ctx = false,
}: IGetNotificationsDTO): Promise<IPaginatedNotifications> => {
  if (!ctx) return await apiCompany.get(`/notifications`).then(({ data }) => data)
  return apiCompanySSR(ctx)
    .get(`/notifications`)
    .then(({ data }) => data)
}

export const updateCompanyNotifications = async ({
  notificationsId,
}: IUpdateNotificationsDTO): Promise<void> => {
  return await apiCompany.put(`/notifications`, { notificationsId }).then(({ data }) => data)
}

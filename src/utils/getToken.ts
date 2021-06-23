import { parseCookies } from 'nookies'
import { COOKIE_COMPANY_TOKEN } from '../configs/constants'

export const getCompanyToken = (ctx: any) => {
  const cookies = parseCookies(ctx)
  const token = cookies[COOKIE_COMPANY_TOKEN]

  return token
}

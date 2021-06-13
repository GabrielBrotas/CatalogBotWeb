import axios from 'axios'
import { parseCookies } from 'nookies'
import { API_URL, COOKIE_COMPANY_TOKEN, COOKIE_CLIENT_TOKEN } from '../configs/constants'

export function apiCompanySSR(ctx = undefined) {
  const cookies = parseCookies(ctx)
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies[COOKIE_COMPANY_TOKEN]}`,
    },
  })

  return api
}

export const apiCompany = apiCompanySSR()

export function apiClientSSR(ctx = undefined) {
  const cookies = parseCookies(ctx)
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies[COOKIE_CLIENT_TOKEN]}`,
    },
  })

  return api
}

export const apiClient = apiClientSSR()

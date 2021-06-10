import axios from 'axios'
import { parseCookies } from 'nookies'
import { API_URL } from '../configs/constants'

export function setupAPIClient(ctx = undefined) {
  const cookies = parseCookies(ctx)
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies['@CatalogBot.token']}`,
    },
  })

  return api
}

export const api = setupAPIClient()

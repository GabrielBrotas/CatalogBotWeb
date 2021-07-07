import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { API_URL, COOKIE_COMPANY_TOKEN, COOKIE_CLIENT_TOKEN } from '../configs/constants'
import { signOutCompany } from '../contexts/AuthCompany'

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

// middleware interceptors, vai executar depois que o backend nos retornar as respostas antes de passar para a funcao
// primeiro parametro é se der sucesso
apiCompany.interceptors.response.use(
  (response) => {
    return response // neste caso vamos apenas retornar
  },
  (error: AxiosError) => {
    // resposta deu erro
    if (error && error.response && error.response.status === 401) {
      signOutCompany()
    } else {
      return Promise.reject(error)
    }
  }
)

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

import axios, { AxiosError } from 'axios'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import {
  API_URL,
  COOKIE_COMPANY_TOKEN,
  COOKIE_CLIENT_TOKEN,
  COOKIE_COMPANY_REFRESH_TOKEN,
} from '../configs/constants'
import { signOutCompany } from '../contexts/AuthCompany'
import { AuthTokenError } from '../errors/AuthTokenError'

let isRefreshing = false
let failedRequestsQueue = [] // array de fila das requests que deram falha

export function apiCompanySSR(ctx = undefined) {
  let cookies = parseCookies(ctx)
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies[COOKIE_COMPANY_TOKEN]}`,
    },
  })

  // middleware interceptors, vai executar depois que o backend nos retornar as respostas antes de passar para a funcao
  // primeiro parametro é se der sucesso
  api.interceptors.response.use(
    (response) => {
      return response // neste caso vamos apenas retornar
    },
    (error: AxiosError) => {
      // resposta deu erro
      if (error.response && error.response.status === 429) {
        if (error.response.data?.message === 'token.expired') {
          // renovar token
          cookies = parseCookies(ctx)

          const { '@CatalogBot.refreshtokenid.company': refreshTokenId } = cookies // pegar o cookie antigo
          const originalConfig = error.config // pegar a request que deu erro, aqui contem os dados que foram feitos para a rota ex: parametros, dados, url, token, callback, etc.

          if (!isRefreshing) {
            isRefreshing = true

            api
              .post('/companies/refresh-token', {
                refresh_token: refreshTokenId,
              })
              .then((response) => {
                const { token } = response.data
                setCookie(ctx, COOKIE_COMPANY_TOKEN, token, {
                  maxAge: 60 * 60 * 24 * 30, // 30 dias, a responsabilidade de remover os tokens é do backend
                  path: '/', // quais caminhos da aplicação tem acesso ao cookie, neste caso é global
                })

                destroyCookie(ctx, COOKIE_COMPANY_REFRESH_TOKEN)
                if (response.data.refreshToken) {
                  setCookie(ctx, COOKIE_COMPANY_REFRESH_TOKEN, response.data.refreshToken._id),
                    {
                      maxAge: 60 * 60 * 24 * 30,
                      path: '/',
                    }
                } else {
                  setCookie(ctx, COOKIE_COMPANY_REFRESH_TOKEN, refreshTokenId),
                    {
                      maxAge: 60 * 60 * 24 * 30,
                      path: '/',
                    }
                }

                api.defaults.headers['Authorization'] = `Bearer ${token}`

                // executar as funcoes da fila com o novo token
                failedRequestsQueue.forEach((request) => request.onSuccess(token))
                failedRequestsQueue = []
              })
              .catch((err) => {
                failedRequestsQueue.forEach((request) => request.onFail(err))
                failedRequestsQueue = []
                // essa funcao so pode ser chamada pelo lado do cliente
                if (process.browser) {
                  signOutCompany()
                }
              })
              .finally(() => {
                isRefreshing = false
              })
          }

          // identificar as outras requisicoes que estao sendo feitas enquanto o token esta sendo atualizado e esperar o token atualizar para poder realizar elas novamente, vamos guardar as funcoes dentro de uma promise pois vao ser assincronas e o axios nao aceita await dentro do interceptor
          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers['Authorization'] = `Bearer ${token}` // vai substituir o token pelo novo
                resolve(api(originalConfig)) // executar a funcao
              },
              onFail: (error: AxiosError) => {
                // caso nao consiga resolver o erro mesmo assim apenas retorna com o erro
                reject(error)
              },
            })
          })
        } else {
          // deslogar usuario
          if (process.browser) {
            signOutCompany()
          } else {
            // mandar um erro para o srr dizendo o tipo de erro para poder fazer uma tratativa
            return Promise.reject(new AuthTokenError())
          }
        }
      }

      // se for qualquer outro tipo de erro continuar para a rota tratar
      return Promise.reject(error)
    }
  )

  return api
}

export const apiCompany = apiCompanySSR()

// ? client
export function apiClientSSR(ctx = undefined) {
  const cookies = parseCookies(ctx)
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies[COOKIE_CLIENT_TOKEN]}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })

  return api
}

export const apiClient = apiClientSSR()

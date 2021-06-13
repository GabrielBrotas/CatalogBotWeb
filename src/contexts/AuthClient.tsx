import { createContext, useContext, useEffect, useState } from 'react'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { apiCompany } from '../services/api'
import { getMyClient, signInClient } from '../services/apiFunctions/clients/client'
import { COOKIE_CLIENT_TOKEN } from '../configs/constants'
import { Client } from '../services/apiFunctions/clients/client/types'

type SignInCredentials = {
  user: string
  password: string
}

type AuthContextData = {
  signOutClient(): void
  loginClient(credentials: SignInCredentials): Promise<void>
  isAuthenticated: boolean
  client: Client
}

const AuthContext = createContext({} as AuthContextData)

export function signOutClient() {
  destroyCookie(undefined, COOKIE_CLIENT_TOKEN)
}

export const AuthClientProvider: React.FC = ({ children }) => {
  const [client, setClient] = useState<Client>()
  const isAuthenticated = !!client

  useEffect(() => {
    const { '@CatalogBot.token.client': token } = parseCookies()

    if (token) {
      getMyClient({})
        .then((response) => {
          const { _id, email, cellphone, name, defaultAddress } = response

          setClient({
            _id,
            email,
            cellphone,
            name,
            defaultAddress,
          })
        })
        .catch((err) => {
          if (err.response.status === 401) {
            signOutClient()
          }
        })
    }
  }, [])

  async function loginClient({ user, password }: SignInCredentials) {
    const { client, token } = await signInClient({ user, password })

    setCookie(undefined, COOKIE_CLIENT_TOKEN, token, {
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    setClient(client)

    apiCompany.defaults.headers['Authorization'] = `Bearer ${token}`
  }

  return (
    <AuthContext.Provider value={{ loginClient, signOutClient, isAuthenticated, client }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useClientAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(`useAuth must be used within a provider`)
  }

  return context
}

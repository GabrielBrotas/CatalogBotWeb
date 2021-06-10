import { createContext, useContext, useEffect, useState } from 'react'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { api } from '../services/api'
import Router from 'next/router'
import { Company } from '../services/apiFunctions/company/types'
import { getMyCompany, signInCompany } from '../services/apiFunctions/company'
import { Client } from '../services/apiFunctions/client/types'
import { getMyClient, signInClient } from '../services/apiFunctions/client'

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
  destroyCookie(undefined, '@CatalogBot.token')
}

export const AuthClientProvider: React.FC = ({ children }) => {
  const [client, setClient] = useState<Client>()
  const isAuthenticated = !!client

  useEffect(() => {
    const { '@CatalogBot.token': token } = parseCookies()

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

    setCookie(undefined, '@CatalogBot.token', token, {
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    setClient(client)

    api.defaults.headers['Authorization'] = `Bearer ${token}`
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

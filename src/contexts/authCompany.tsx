import { createContext, useContext, useEffect, useState } from 'react'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { api } from '../services/api'
import Router from 'next/router'
import { Company } from '../services/apiFunctions/company/types'
import { getMyCompany, signInCompany } from '../services/apiFunctions/company'

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signOutCompany(): void
  loginCompany(credentials: SignInCredentials): Promise<void>
  isAuthenticated: boolean
  company: Company
}

const AuthContext = createContext({} as AuthContextData)

export function signOutCompany() {
  destroyCookie(undefined, '@CatalogBot.token')
  Router.push('/')
}

export const AuthCompanyProvider: React.FC = ({ children }) => {
  const [company, setCompany] = useState<Company>()
  const isAuthenticated = !!company

  useEffect(() => {
    const { '@CatalogBot.token': token } = parseCookies()

    if (token) {
      getMyCompany({})
        .then((response) => {
          const { email, name, benefits, mainImageUrl, shortDescription, workTime } = response

          setCompany({
            email,
            name,
            benefits,
            mainImageUrl,
            shortDescription,
            workTime,
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])

  async function loginCompany({ email, password }: SignInCredentials) {
    const { company, token } = await signInCompany({ email, password })

    setCookie(undefined, '@CatalogBot.token', token, {
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    setCompany(company)

    api.defaults.headers['Authorization'] = `Bearer ${token}`

    Router.push('/dashboard')
  }

  return (
    <AuthContext.Provider value={{ loginCompany, signOutCompany, isAuthenticated, company }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useCompanyAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(`useAuth must be used within a provider`)
  }

  return context
}

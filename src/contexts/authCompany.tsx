import { createContext, useContext, useEffect, useState } from 'react'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { apiCompany } from '../services/api'
import Router from 'next/router'
import { Company } from '../services/apiFunctions/companies/company/types'
import { getMyCompany, signInCompany } from '../services/apiFunctions/companies/company'
import { COOKIE_COMPANY_TOKEN } from '../configs/constants'

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
  destroyCookie(undefined, COOKIE_COMPANY_TOKEN)
  Router.push('/')
}

export const AuthCompanyProvider: React.FC = ({ children }) => {
  const [company, setCompany] = useState<Company>()
  const isAuthenticated = !!company

  useEffect(() => {
    const { '@CatalogBot.token.company': token } = parseCookies()

    if (token) {
      getMyCompany({})
        .then((response) => {
          const { _id, email, name, benefits, mainImageUrl, shortDescription, workTime } = response

          setCompany({
            _id,
            email,
            name,
            benefits,
            mainImageUrl,
            shortDescription,
            workTime,
          })
        })
        .catch((err) => {
          if (err.response.status === 401) {
            signOutCompany()
          }
        })
    }
  }, [])

  async function loginCompany({ email, password }: SignInCredentials) {
    const { company, token } = await signInCompany({ email, password })

    setCookie(undefined, COOKIE_COMPANY_TOKEN, token, {
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    setCompany(company)

    apiCompany.defaults.headers['Authorization'] = `Bearer ${token}`

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

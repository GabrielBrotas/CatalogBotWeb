import { createContext, useContext, useEffect, useState } from 'react'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { apiCompany } from '../services/api'
import Router from 'next/router'
import { Company } from '../services/apiFunctions/companies/company/types'
import { getMyCompany, signInCompany } from '../services/apiFunctions/companies/company'
import { COOKIE_COMPANY_TOKEN, NOTIFICATION_SOUND } from '../configs/constants'
import { useWebSockets, WppConnectionData } from '../hooks/useWebSocket'
import { IPaginatedNotifications } from '../services/apiFunctions/clients/notifications/types'
import { getCompanyNotifications } from '../services/apiFunctions/companies/notifications'

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signOutCompany(): void
  loginCompany(credentials: SignInCredentials): Promise<void>
  isAuthenticated: boolean
  company: Company
  companyNotifications: IPaginatedNotifications
  setCompanyNotifications: React.Dispatch<React.SetStateAction<IPaginatedNotifications>>
  connectWhatsapp: () => void
  wppConnectionData: WppConnectionData
  qrCode: string
  isWppConnected: boolean
  wppConnIsLoading: boolean
  disconnectWhatsApp: () => void
  isSocketConnected: boolean
}

const AuthContext = createContext({} as AuthContextData)

export function signOutCompany() {
  destroyCookie(undefined, COOKIE_COMPANY_TOKEN)
  Router.push('/')
}

export const AuthCompanyProvider: React.FC = ({ children }) => {
  const [company, setCompany] = useState<Company>()
  const [companyNotifications, setCompanyNotifications] = useState<IPaginatedNotifications>()

  const isAuthenticated = !!company

  const {
    newNotification,
    setNewNotification,
    connectToWhatsApp,
    wppConnectionData,
    qrCode,
    isWppConnected,
    disconnectWhatsApp,
    wppConnIsLoading,
    isSocketConnected,
  } = useWebSockets({
    userId: company && company._id,
    enabled: !!company,
  })

  useEffect(() => {
    const { '@CatalogBot.token.company': token } = parseCookies()

    if (token) {
      Promise.all([getMyCompany({}), getCompanyNotifications({})])
        .then(([companyResponse, notificationsResponse]) => {
          const {
            _id,
            email,
            name,
            benefits,
            mainImageUrl,
            shortDescription,
            workTime,
            acceptedPaymentMethods,
            Views,
          } = companyResponse

          setCompany({
            _id,
            email,
            name,
            benefits,
            mainImageUrl,
            shortDescription,
            workTime,
            acceptedPaymentMethods,
            Views,
          })

          setCompanyNotifications(notificationsResponse)
        })
        .catch(() => {
          signOutCompany()
        })
    }
  }, [])

  useEffect(() => {
    if (newNotification && String(newNotification.Receiver) === String(company._id)) {
      new Audio(NOTIFICATION_SOUND).play()
      setCompanyNotifications(({ results, total, next, previous }) => ({
        results: [newNotification, ...results],
        total,
        next,
        previous,
      }))
      setNewNotification(null)
    }
  }, [company, newNotification, setNewNotification])

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

  async function connectWhatsapp() {
    if (isSocketConnected) {
      connectToWhatsApp()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        loginCompany,
        signOutCompany,
        isAuthenticated,
        company,
        companyNotifications,
        setCompanyNotifications,
        connectWhatsapp,
        wppConnectionData,
        qrCode,
        isWppConnected,
        wppConnIsLoading,
        disconnectWhatsApp,
        isSocketConnected,
      }}
    >
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

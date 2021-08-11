import { createContext, useContext, useEffect, useState } from 'react'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { apiClient } from '../services/api'
import { getMyClient, signInClient } from '../services/apiFunctions/clients/client'
import { COOKIE_CLIENT_TOKEN, NOTIFICATION_SOUND } from '../configs/constants'
import { Client } from '../services/apiFunctions/clients/client/types'
import { useDisclosure } from '@chakra-ui/react'
import { useWebSockets } from '../hooks/useWebSocket'
import { IPaginatedNotifications } from '../services/apiFunctions/clients/notifications/types'
import { getClientNotifications } from '../services/apiFunctions/clients/notifications'
import { Notification } from '../services/apiFunctions/clients/notifications/types'
import { useRouter } from 'next/router'

type SignInCredentials = {
  user: string
  password: string
}

type AuthContextData = {
  signOut(): void
  loginClient(credentials: SignInCredentials): Promise<void>
  isAuthenticated: boolean
  client: Client
  isModalOpen: boolean
  formType: 'register' | 'login'
  setFormType: React.Dispatch<React.SetStateAction<'register' | 'login'>>
  openModal: ({ type }: { type: 'register' | 'login' }) => void
  closeModal: () => void
  clientsNotifications: IPaginatedNotifications
  setClientsNotifications: React.Dispatch<React.SetStateAction<IPaginatedNotifications>>
  newNotification: Notification
}

const AuthContext = createContext({} as AuthContextData)

export function signOutClient() {
  destroyCookie(undefined, COOKIE_CLIENT_TOKEN, { path: '/' })
}

export const AuthClientProvider: React.FC = ({ children }) => {
  const [formType, setFormType] = useState<'register' | 'login'>('register')
  const {
    isOpen: isModalOpen,
    onOpen: openRegisterModal,
    onClose: closeRegisterModal,
  } = useDisclosure()
  const router = useRouter()

  const [client, setClient] = useState<Client>()
  const [clientsNotifications, setClientsNotifications] = useState<IPaginatedNotifications>()
  const isAuthenticated = !!client

  const { newNotification, setNewNotification } = useWebSockets({
    userId: client && client._id,
    enabled: !!client,
  })

  useEffect(() => {
    const { '@CatalogBot.token.client': token } = parseCookies()

    if (token) {
      Promise.all([
        getMyClient({}),
        getClientNotifications({ Sender: String(router.query.companyId) }),
      ])
        .then(([clientResponse, notificationsResponse]) => {
          const { _id, email, cellphone, name, defaultAddress } = clientResponse

          setClient({
            _id,
            email,
            cellphone,
            name,
            defaultAddress,
          })

          if (notificationsResponse) {
            setClientsNotifications(notificationsResponse)
          }
        })
        .catch(() => {
          signOutClient()
        })
    }
  }, [router, router.query.companyId])

  useEffect(() => {
    if (newNotification && String(newNotification.Receiver) === String(client._id)) {
      new Audio(NOTIFICATION_SOUND).play()

      setClientsNotifications(({ results = [], total, next, previous }) => ({
        results: [newNotification, ...results],
        total,
        next,
        previous,
      }))

      setNewNotification(null)
    }
  }, [client, newNotification, setNewNotification, setClientsNotifications, clientsNotifications])

  async function loginClient({ user, password }: SignInCredentials) {
    const { client, token } = await signInClient({ user, password })

    setCookie(undefined, COOKIE_CLIENT_TOKEN, token, {
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    apiClient.defaults.headers['Authorization'] = `Bearer ${token}`
    setClient(client)
  }

  async function openModal({ type }: { type: 'register' | 'login' }) {
    setFormType(type)
    openRegisterModal()
  }

  async function closeModal() {
    closeRegisterModal()
  }

  const signOut = () => {
    signOutClient()
    setClient(null)
  }

  return (
    <AuthContext.Provider
      value={{
        loginClient,
        signOut,
        isAuthenticated,
        client,
        isModalOpen,
        openModal,
        closeModal,
        formType,
        setFormType,
        clientsNotifications,
        setClientsNotifications,
        newNotification,
      }}
    >
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

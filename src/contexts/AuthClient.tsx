import { createContext, useContext, useEffect, useState } from 'react'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { apiClient } from '../services/api'
import { getMyClient, signInClient } from '../services/apiFunctions/clients/client'
import { COOKIE_CLIENT_TOKEN } from '../configs/constants'
import { Client } from '../services/apiFunctions/clients/client/types'
import { useDisclosure } from '@chakra-ui/react'

type SignInCredentials = {
  user: string
  password: string
}

type AuthContextData = {
  signOutClient(): void
  loginClient(credentials: SignInCredentials): Promise<void>
  isAuthenticated: boolean
  client: Client
  isModalOpen: boolean
  formType: 'register' | 'login'
  setFormType: React.Dispatch<React.SetStateAction<'register' | 'login'>>
  openModal: ({ type }: { type: 'register' | 'login' }) => void
  closeModal: () => void
}

const AuthContext = createContext({} as AuthContextData)

export function signOutClient() {
  destroyCookie(undefined, COOKIE_CLIENT_TOKEN)
}

export const AuthClientProvider: React.FC = ({ children }) => {
  const [formType, setFormType] = useState<'register' | 'login'>('register')
  const {
    isOpen: isModalOpen,
    onOpen: openRegisterModal,
    onClose: closeRegisterModal,
  } = useDisclosure()

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

  return (
    <AuthContext.Provider
      value={{
        loginClient,
        signOutClient,
        isAuthenticated,
        client,
        isModalOpen,
        openModal,
        closeModal,
        formType,
        setFormType,
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

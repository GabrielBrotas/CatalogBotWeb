import { apiClient, apiClientSSR } from '../../../api'
import { RequestFromSSR } from '../../companies/company/types'
import { Client, ICreateClientDTO, ILoginClientDTO, SignInClientResponse } from './types'

export const signUpClient = async ({
  name,
  email,
  password,
  cellphone,
  defaultAddress,
}: ICreateClientDTO): Promise<void> => {
  return await apiClient
    .post('/clients', { name, email, password, cellphone, defaultAddress })
    .then(({ data }) => data)
}

export const signInClient = async ({
  user,
  password,
}: ILoginClientDTO): Promise<SignInClientResponse> => {
  return apiClient.post('/clients/auth', { user, password }).then(({ data }) => data)
}

export const getMyClient = async ({ ctx = false }: RequestFromSSR): Promise<Client> => {
  if (!ctx) return await apiClient.get('/clients/me').then(({ data }) => data)
  return apiClientSSR(ctx)
    .get('/clients/me')
    .then(({ data }) => data)
}

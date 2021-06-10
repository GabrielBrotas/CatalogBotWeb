import { api, setupAPIClient } from '../../api'
import { RequestFromSSR } from '../company/types'
import { Client, ICreateClientDTO, ILoginClientDTO, SignInClientResponse } from './types'

export const signUpClient = async ({
  name,
  email,
  password,
  cellphone,
  defaultAddress,
}: ICreateClientDTO): Promise<void> => {
  return await api
    .post('/companies', { name, email, password, cellphone, defaultAddress })
    .then(({ data }) => data)
}

export const signInClient = async ({
  user,
  password,
}: ILoginClientDTO): Promise<SignInClientResponse> => {
  return api.post('/clients/auth', { user, password }).then(({ data }) => data)
}

export const getMyClient = async ({ ctx = false }: RequestFromSSR): Promise<Client> => {
  if (!ctx) return await api.get('/clients/me').then(({ data }) => data)
  return setupAPIClient(ctx)
    .get('/clients/me')
    .then(({ data }) => data)
}

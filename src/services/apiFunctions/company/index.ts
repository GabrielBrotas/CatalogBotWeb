import { api, setupAPIClient } from '../../api'
import {
  Company,
  IUpdateCompanyDTO,
  IUploadedFile,
  IUploadFile,
  LoginDTO,
  RequestFromSSR,
  SignUpDTO,
} from './types'

export const signUpCompany = async ({ email, name, password }: SignUpDTO): Promise<void> => {
  return await api.post('/companies', { email, name, password }).then(({ data }) => data)
}

interface SignInCompanyResponse {
  company: Company
  token: string
}
export const signInCompany = async ({
  email,
  password,
}: LoginDTO): Promise<SignInCompanyResponse> => {
  return api.post('/companies/auth', { email, password }).then(({ data }) => data)
}

export const getMyCompany = async ({ ctx = false }: RequestFromSSR): Promise<Company> => {
  if (!ctx) return await api.get('/companies').then(({ data }) => data)
  return setupAPIClient(ctx)
    .get('/companies')
    .then(({ data }) => data)
}

export const updateCompany = async ({
  name,
  benefits,
  shortDescription,
  workTime,
}: IUpdateCompanyDTO): Promise<Company> => {
  return await api
    .put('/companies', { name, benefits, shortDescription, workTime })
    .then(({ data }) => data)
}

export const updateCompanyImage = async ({
  file,
  id,
  setChangeProgress,
}: IUploadFile): Promise<IUploadedFile> => {
  const formData: any = new FormData()
  formData.append('image', file)

  return await api
    .patch('/companies/me/image', formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
      onUploadProgress: (e) => {
        const progress = Number(Math.round((e.loaded * 100) / e.total))
        if (setChangeProgress && id) {
          setChangeProgress([progress, id])
        }
      },
    })
    .then(({ data }) => data)
}

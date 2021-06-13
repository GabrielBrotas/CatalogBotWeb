import { apiCompany, apiCompanySSR } from '../../../api'
import {
  Company,
  GetCompanyDTO,
  IUpdateCompanyDTO,
  IUploadedFile,
  IUploadFile,
  LoginDTO,
  RequestFromSSR,
  SignInCompanyResponse,
  SignUpDTO,
} from './types'

export const signUpCompany = async ({ email, name, password }: SignUpDTO): Promise<void> => {
  return await apiCompany.post('/companies', { email, name, password }).then(({ data }) => data)
}

export const signInCompany = async ({
  email,
  password,
}: LoginDTO): Promise<SignInCompanyResponse> => {
  return apiCompany.post('/companies/auth', { email, password }).then(({ data }) => data)
}

export const getCompany = async ({ companyId, ctx = false }: GetCompanyDTO): Promise<Company> => {
  if (!ctx) return await apiCompany.get(`/companies/${companyId}`).then(({ data }) => data)
  return apiCompanySSR(ctx)
    .get(`/companies/${companyId}`)
    .then(({ data }) => data)
}

export const getMyCompany = async ({ ctx = false }: RequestFromSSR): Promise<Company> => {
  if (!ctx) return await apiCompany.get('/companies').then(({ data }) => data)
  return apiCompanySSR(ctx)
    .get('/companies')
    .then(({ data }) => data)
}

export const updateCompany = async ({
  name,
  benefits,
  shortDescription,
  workTime,
}: IUpdateCompanyDTO): Promise<Company> => {
  return await apiCompany
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

  return await apiCompany
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

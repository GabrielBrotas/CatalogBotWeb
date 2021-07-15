export type SignUpDTO = {
  name: string
  email: string
  password: string
}

export type LoginDTO = {
  email: string
  password: string
}

export type SignInCompanyResponse = {
  company: Company
  token: string
  refreshToken: {
    company: string
    client: null
    created_at: string
    _id: string
    expiresIn: number
  }
}

export type CompanyWorkTime = {
  day: number
  from: string
  to: string
}

export type CompanyPaymentMethods = {
  boleto: boolean
  creditCard: boolean
  pix: boolean
  money: boolean
  debit: boolean
}

export type Company = {
  _id: string
  email: string
  name: string
  mainImageUrl?: string
  workTime?: CompanyWorkTime[]
  shortDescription?: string
  acceptedPaymentMethods: CompanyPaymentMethods
  benefits?: string[]
  Views: Array<{ client: string; date: Date }>
}

export type IUpdateCompanyDTO = {
  name?: string
  workTime?: CompanyWorkTime[]
  shortDescription?: string
  acceptedPaymentMethods: CompanyPaymentMethods
  benefits?: string[]
}

export type RequestFromSSR = {
  ctx?: any
}

export type GetCompanyDTO = {
  companyId: string
  ctx?: any
}

export interface IUploadFile {
  file: File
  id?: string
  setChangeProgress?: React.Dispatch<React.SetStateAction<any>>
}

export interface IUploadedFile {
  url: string
  mimetype: string
}

export type DataAnalysis = {
  _id: string
  company: string
  type: 'view' | 'order'
  client?: string
  order?: string
  created_at: string
}

export type IGetMyDataAnalysisDTO = {
  companyId: string
  ctx?: any
}

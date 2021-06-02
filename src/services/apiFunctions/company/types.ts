export type SignUpDTO = {
  name: string
  email: string
  password: string
}

export type LoginDTO = {
  email: string
  password: string
}

export type CompanyWorkTime = {
  day: number
  from: string
  to: string
}

export type Company = {
  email: string
  name: string
  mainImageUrl?: string
  workTime?: CompanyWorkTime[]
  shortDescription?: string
  benefits?: string[]
}

export type IUpdateCompanyDTO = {
  name?: string
  workTime?: CompanyWorkTime[]
  shortDescription?: string
  benefits?: string[]
}

export type RequestFromSSR = {
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

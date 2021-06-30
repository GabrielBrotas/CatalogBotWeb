export type Client = {
  _id: string
  name: string
  email: string
  password?: string
  cellphone: string
  defaultAddress?: Address
}

export type Address = {
  state: string
  city: string
  street: string
  neighborhood?: string
  number?: string
  cep: string
}

export type ICreateClientDTO = {
  name: string
  email: string
  password: string
  cellphone?: string
  defaultAddress?: Address
}

export type ILoginClientDTO = {
  user: string
  password: string
}

export type SignInClientResponse = {
  client: Client
  token: string
}

export type IAddCompanyDataDTO = {
  clientId?: string
  orderId?: string
  companyId: string
  type: 'order' | 'view'
}

import { Category } from '../categories/types'

export type OptionAdditional = {
  name: string
  price: number
}

export type ProductOption = {
  name: string
  isRequired: boolean
  maxQuantity: number
  minQuantity: number
  additionals: OptionAdditional[]
}

export type CreateProductDTO = {
  name: string
  price: number
  categoryId: string
  description?: string
  options?: ProductOption[]
}

export type UpdateProductDTO = {
  productId: string
  name: string
  price: number
  categoryId: string
  description?: string
  options?: ProductOption[]
}

export type Product = {
  _id: string
  name: string
  price: number
  description?: string
  category: Category
  imageUrl?: string
  options?: ProductOption[]
  companyId: string
  created_at: Date
  updated_at: Date
}

export type GetProductDTO = {
  productId: string
  ctx?: any
}

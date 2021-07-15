import { Category } from '../categories/types'

export type OptionAdditional = {
  _id?: string
  name: string
  price: number
  priceFormated?: string
}

export type ProductOption = {
  _id?: string
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
  removeImage?: boolean
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
  priceFormated?: string
}

export type GetProductDTO = {
  productId: string
  ctx?: any
}

export type GetProductsDTO = {
  companyId: string
  page?: string | number
  limit?: string | number
  ctx?: any
}

type SubPagination = {
  page: number
  limit: number
}

export type Pagination = {
  next?: SubPagination | null
  previous?: SubPagination | null
  total: number
}

export interface ListResultProps extends Pagination {
  results: Product[]
}

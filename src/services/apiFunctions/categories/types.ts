import { Company } from '../company/types'

export type Category = {
  _id: string
  name: string
  company: Company
  created_at: Date
  updated_at: Date
}

export interface UpdateCategoryDTO {
  categoryId: string
  name: string
}

export interface GetCategoryDTO {
  categoryId: string
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

export interface ListCategoriesResultProps extends Pagination {
  results: Category[]
}

export type GetCategoriesDTO = {
  companyId: string
  page?: number
  limit?: number
  ctx?: any
}

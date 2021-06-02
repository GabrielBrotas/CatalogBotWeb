export type Category = {
  _id: string
  name: string
  companyId: string
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

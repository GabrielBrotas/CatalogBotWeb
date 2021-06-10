import { api, setupAPIClient } from '../../api'
import {
  Category,
  GetCategoryDTO,
  GetCategoriesDTO,
  ListCategoriesResultProps,
  UpdateCategoryDTO,
} from './types'

export const getCategories = async ({
  page = 1,
  limit = 10,
  ctx,
  companyId,
}: GetCategoriesDTO): Promise<ListCategoriesResultProps> => {
  if (!ctx)
    return await api
      .get(`/categories/${companyId}?page=${page}&limit=${limit}`)
      .then(({ data }) => data)
  return setupAPIClient(ctx)
    .get(`/categories/${companyId}?page=${page}&limit=${limit}`)
    .then(({ data }) => data)
}

export const createCategory = async ({ name }: { name: string }): Promise<Category> => {
  return await api.post(`/categories/`, { name }).then(({ data }) => data)
}

export const deleteCategory = async (categoryId: string): Promise<void> => {
  return await api.delete(`/categories/${categoryId}`).then(({ data }) => data)
}

export const updateCategory = async ({
  categoryId,
  name,
}: UpdateCategoryDTO): Promise<Category> => {
  return await api.put(`/categories/${categoryId}`, { name }).then(({ data }) => data)
}

export const getCategory = async ({ categoryId, ctx }: GetCategoryDTO): Promise<Category> => {
  if (!ctx) return await api.get(`/categories/category/${categoryId}`).then(({ data }) => data)
  return setupAPIClient(ctx)
    .get(`/categories/${categoryId}`)
    .then(({ data }) => data)
}

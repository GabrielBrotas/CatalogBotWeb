import { apiCompany, apiCompanySSR } from '../../../api'
import {
  CreateProductDTO,
  UpdateProductDTO,
  Product,
  GetProductDTO,
  ListResultProps,
  GetProductsDTO,
} from './types'

export const getProducts = async ({
  page = 1,
  limit = 10,
  ctx,
  companyId,
}: GetProductsDTO): Promise<ListResultProps> => {
  if (!ctx)
    return await apiCompany
      .get(`/products/${companyId}?page=${page}&limit=${limit}`)
      .then(({ data }) => data)
  return apiCompanySSR(ctx)
    .get(`/products/${companyId}?page=${page}&limit=${limit}`)
    .then(({ data }) => data)
}

export const createProduct = async (data: CreateProductDTO): Promise<Product> => {
  return await apiCompany.post(`/products/`, { ...data }).then(({ data }) => data)
}

export const deleteProduct = async (productId: string): Promise<void> => {
  return await apiCompany.delete(`/products/${productId}`).then(({ data }) => data)
}

export const updateProduct = async ({
  productId,
  categoryId,
  name,
  price,
  description,
  options,
}: UpdateProductDTO): Promise<Product> => {
  return await apiCompany
    .put(`/products/${productId}`, { categoryId, name, price, description, options })
    .then(({ data }) => data)
}

export const getProduct = async ({ productId, ctx }: GetProductDTO): Promise<Product> => {
  if (!ctx) return await apiCompany.get(`/products/product/${productId}`).then(({ data }) => data)
  return apiCompanySSR(ctx)
    .get(`/products/product/${productId}`)
    .then(({ data }) => data)
}

export interface IUploadImage {
  productId: string
  image: File
  id?: string
  setChangeProgress?: React.Dispatch<React.SetStateAction<any>>
}

export const updateProductImage = async ({
  productId,
  image,
  id,
  setChangeProgress,
}: IUploadImage): Promise<Product> => {
  const formData: any = new FormData()
  formData.append('image', image)
  return await apiCompany
    .patch(`/products/${productId}/image`, formData, {
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

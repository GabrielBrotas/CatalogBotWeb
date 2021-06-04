import { api, setupAPIClient } from '../../api'
import { CreateProductDTO, UpdateProductDTO, Product, GetProductDTO } from './types'

export const getMyProducts = async (ctx?: any): Promise<Product[]> => {
  if (!ctx) return await api.get('/products').then(({ data }) => data)
  return setupAPIClient(ctx)
    .get('/products')
    .then(({ data }) => data)
}

export const createProduct = async (data: CreateProductDTO): Promise<Product> => {
  return await api.post(`/products/`, { ...data }).then(({ data }) => data)
}

export const deleteProduct = async (productId: string): Promise<void> => {
  return await api.delete(`/products/${productId}`).then(({ data }) => data)
}

export const updateProduct = async ({
  productId,
  categoryId,
  name,
  price,
  description,
  options,
}: UpdateProductDTO): Promise<Product> => {
  return await api
    .put(`/products/${productId}`, { categoryId, name, price, description, options })
    .then(({ data }) => data)
}

export const getProduct = async ({ productId, ctx }: GetProductDTO): Promise<Product> => {
  if (!ctx) return await api.get(`/products/${productId}`).then(({ data }) => data)
  return setupAPIClient(ctx)
    .get(`/products/${productId}`)
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
  return await api
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

import { string, array, object, boolean } from 'yup'
import { ProductOption } from '../../../services/apiFunctions/companies/products/types'

export type EditProductFormData = {
  id?: string
  name: string
  price: number | string
  description?: string
  options?: ProductOption[]
  categoryId: string
}

export const editProductFormSchema = object().shape({
  name: string().required('Nome obrigatório'),
  price: string().required('Valor obrigatório'),
  description: string(),
  categoryId: string().required('Categoria obrigatória'),
  options: array(
    object({
      name: string().required('Nome da opção obrigatório'),
      isRequired: boolean(),
      maxQuantity: string().required('Quantidade maxima obrigatório'),
      minQuantity: string().required('Quantidade mínima obrigatório'),
      additionals: array(
        object({
          name: string().required('Nome obrigatório'),
          price: string().required('Valor obrigatório'),
        })
      ),
    })
  ),
})

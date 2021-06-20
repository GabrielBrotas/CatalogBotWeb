import * as yup from 'yup'
import { ProductOption } from '../../../services/apiFunctions/companies/products/types'

export type EditProductFormData = {
  id?: string
  name: string
  price: number | string
  description?: string
  options?: ProductOption[]
  categoryId: string
}

export const editProductFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  price: yup.string().required('Valor obrigatório'),
  description: yup.string(),
  categoryId: yup.string().required('Categoria obrigatória'),
  options: yup.array(
    yup.object({
      name: yup.string().required('Nome da opção obrigatório'),
      isRequired: yup.boolean(),
      maxQuantity: yup.string().required('Quantidade maxima obrigatório'),
      minQuantity: yup.string().required('Quantidade mínima obrigatório'),
      additionals: yup.array(
        yup.object({
          name: yup.string().required('Nome obrigatório'),
          price: yup.string().required('Valor obrigatório'),
        })
      ),
    })
  ),
})

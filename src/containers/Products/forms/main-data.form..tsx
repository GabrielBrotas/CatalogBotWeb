import React from 'react'

import { SimpleGrid } from '@chakra-ui/react'

import { FormInput } from '../../../components/Form/input'
import { FormSelect } from '../../../components/Form/select'
import { FormTextArea } from '../../../components/Form/textarea'
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form'
import { Category } from '../../../services/apiFunctions/companies/categories/types'
import { FormPriceMaskedInput } from '../../../components/Form/price-masked-input'
import { CreateProductFormData } from '../Create/types'

interface ProductMainData {
  register: UseFormRegister<CreateProductFormData>
  errors: DeepMap<FieldValues, FieldError>
  categories: Category[]
  defaultName?: string
  defaultPrice?: number
  defaultCategory?: string
  defaultDescription?: string
}

export const ProductMainData = ({
  categories,
  errors,
  register,
  defaultCategory,
  defaultDescription,
  defaultName,
  defaultPrice,
}: ProductMainData) => {
  return (
    <>
      <FormInput
        name="name"
        label="Nome do produto"
        {...register('name')}
        error={errors.name}
        defaultValue={defaultName}
      />
      <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
        <FormPriceMaskedInput
          name="price"
          label="Valor"
          {...register('price')}
          error={errors.price}
          defaultValue={defaultPrice}
        />
        <FormSelect
          name="categoryId"
          label="Categoria"
          {...register('categoryId')}
          options={categories.map((category) => ({
            label: category.name,
            value: category._id,
          }))}
          error={errors.categoryId}
          defaultValue={defaultCategory}
        />
      </SimpleGrid>

      <FormTextArea
        name="description"
        label="Descrição"
        {...register('description')}
        error={errors.description}
        defaultValue={defaultDescription}
      />
    </>
  )
}

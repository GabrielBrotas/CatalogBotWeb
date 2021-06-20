import { Box, Divider, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import {
  Control,
  DeepMap,
  FieldError,
  FieldValues,
  useFieldArray,
  UseFormRegister,
} from 'react-hook-form'
import { Button } from '../../../components/Form/button'
import { FormInput } from '../../../components/Form/input'
import { FormSelect } from '../../../components/Form/select'
import { OptionAdditional } from '../../../services/apiFunctions/companies/products/types'
import { CreateProductFormData } from '../Create/types'
import { AdditionalProductOptionForm } from './additional-product-option.form'

interface ProductOptionFormProps {
  register: UseFormRegister<CreateProductFormData>
  errors: DeepMap<FieldValues, FieldError>
  control: Control<CreateProductFormData>
  productOptionIndex: number
  productOptionAdditionals: OptionAdditional[]
  removeProductOption: (productOptionindex: number) => void
  defaultOptionName?: string
  defaultOptionIsRequired?: boolean
  defaultOptionMinQuantity?: number
  defaultOptionMaxQuantity?: number
}

export const ProductOptionForm = ({
  register,
  errors,
  control,
  removeProductOption,
  productOptionIndex,
  defaultOptionIsRequired,
  defaultOptionMaxQuantity = 1,
  defaultOptionMinQuantity = 1,
  defaultOptionName,
}: ProductOptionFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `options.${productOptionIndex}.additionals`,
  })

  const removeProductAdditionalOptions = (nestedIndex: number) => {
    remove(nestedIndex)
  }

  const addProductAdditionalOptions = () => {
    append({
      _id: Date.now().toString(),
      name: '',
      price: 0,
    })
  }

  return (
    <Box w="100%" textAlign="right">
      <Button
        type="button"
        colorScheme="red"
        justifySelf="flex-end"
        mt={2}
        onClick={() => removeProductOption(productOptionIndex)}
      >
        Remover opção
      </Button>
      <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
        <FormInput
          name={`options.${productOptionIndex}.name` as const}
          label="Nome da opção"
          {...register(`options.${productOptionIndex}.name` as const)}
          error={
            errors.options &&
            errors.options[productOptionIndex] &&
            errors.options[productOptionIndex].name
          }
          defaultValue={defaultOptionName}
        />
        <FormSelect
          name="isRequired"
          label="É obrigatório?"
          {...register(`options.${productOptionIndex}.isRequired`)}
          options={[
            { value: 'true', label: 'Sim' },
            { value: 'false', label: 'Não' },
          ]}
          error={
            errors.options &&
            errors.options[productOptionIndex] &&
            errors.options[productOptionIndex].isRequired
          }
          defaultValue={String(defaultOptionIsRequired)}
        />
      </SimpleGrid>
      <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%" mt={4}>
        <FormInput
          name={`options.${productOptionIndex}.minQuantity`}
          label="Quantidade mínima"
          type="number"
          {...register(`options.${productOptionIndex}.minQuantity`)}
          error={
            errors.options &&
            errors.options[productOptionIndex] &&
            errors.options[productOptionIndex].minQuantity
          }
          defaultValue={defaultOptionMinQuantity}
        />
        <FormInput
          label="Quantidade máxima"
          name={`options.${productOptionIndex}.maxQuantity`}
          type="number"
          {...register(`options.${productOptionIndex}.maxQuantity`)}
          error={
            errors.options &&
            errors.options[productOptionIndex] &&
            errors.options[productOptionIndex].maxQuantity
          }
          defaultValue={defaultOptionMaxQuantity}
        />
      </SimpleGrid>

      {fields.map((itemNest, nestedIndex) => (
        <AdditionalProductOptionForm
          key={itemNest._id}
          errors={errors}
          register={register}
          additionalProductOptionIndex={nestedIndex}
          hasMoreThanOneAdditionalOption={fields.length > 1}
          productOptionIndex={productOptionIndex}
          removeProductAdditionalOptions={removeProductAdditionalOptions}
          addProductAdditionalOptions={addProductAdditionalOptions}
          additionalProductOption={itemNest}
        />
      ))}

      <Divider my="6" borderColor="gray.700" />
    </Box>
  )
}

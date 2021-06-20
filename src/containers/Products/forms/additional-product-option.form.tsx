import { Button, Flex } from '@chakra-ui/react'
import React from 'react'
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form'
import { FormInput } from '../../../components/Form/input'
import { FormPriceMaskedInput } from '../../../components/Form/price-masked-input'
import { OptionAdditional } from '../../../services/apiFunctions/companies/products/types'
import { CreateProductFormData } from '../Create/types'
import { AddProductAdditionalOptionsProps, RemoveProductAdditionalOptionProps } from './types'

interface AdditionalProductOptionProps {
  register: UseFormRegister<CreateProductFormData>
  errors: DeepMap<FieldValues, FieldError>
  productOptionIndex: number
  additionalProductOptionIndex: number
  hasMoreThanOneAdditionalOption: boolean
  removeProductAdditionalOptions: (index: number) => void
  addProductAdditionalOptions: ({ productOptionindex }: AddProductAdditionalOptionsProps) => void
  additionalProductOption?: OptionAdditional
}

export const AdditionalProductOptionForm = ({
  errors,
  register,
  additionalProductOptionIndex,
  productOptionIndex,
  hasMoreThanOneAdditionalOption,
  removeProductAdditionalOptions,
  addProductAdditionalOptions,
  additionalProductOption,
}: AdditionalProductOptionProps) => {
  return (
    <Flex key={additionalProductOptionIndex} w="100%" alignItems="center" gridGap="6" mt={4}>
      <FormInput
        name={`options.${productOptionIndex}.additionals.${additionalProductOptionIndex}.name`}
        label="Nome"
        {...register(
          `options.${productOptionIndex}.additionals.${additionalProductOptionIndex}.name`
        )}
        maxLength={20}
        error={
          errors.options &&
          errors.options[productOptionIndex] &&
          errors.options[productOptionIndex].additionals &&
          errors.options[productOptionIndex].additionals[additionalProductOptionIndex] &&
          errors.options[productOptionIndex].additionals[additionalProductOptionIndex].name
        }
        defaultValue={additionalProductOption?.name}
      />

      <FormPriceMaskedInput
        name={`options.${productOptionIndex}.additionals.${additionalProductOptionIndex}.price`}
        label="Preço"
        {...register(
          `options.${productOptionIndex}.additionals.${additionalProductOptionIndex}.price`
        )}
        error={
          errors.options &&
          errors.options[productOptionIndex] &&
          errors.options[productOptionIndex].additionals &&
          errors.options[productOptionIndex].additionals[additionalProductOptionIndex] &&
          errors.options[productOptionIndex].additionals[additionalProductOptionIndex].price
        }
        defaultValue={additionalProductOption?.price}
      />

      <Button
        type="button"
        colorScheme="pink"
        w="3"
        justifySelf="flex-end"
        mt={4}
        onClick={() =>
          addProductAdditionalOptions({
            productOptionindex: productOptionIndex,
          })
        }
      >
        +
      </Button>

      {hasMoreThanOneAdditionalOption && (
        <Button
          type="button"
          colorScheme="red"
          w="3"
          justifySelf="flex-end"
          mt={4}
          onClick={() => removeProductAdditionalOptions(additionalProductOptionIndex)}
        >
          -
        </Button>
      )}
    </Flex>
  )
}

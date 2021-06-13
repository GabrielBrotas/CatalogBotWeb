import React from 'react'
import { Box, Checkbox, Text } from '@chakra-ui/react'
import { CompanyPaymentMethods } from '../../../../services/apiFunctions/companies/company/types'
import { FormInput } from '../../../Form/input'
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form'

interface AddressFormProps {
  register: UseFormRegister<FieldValues>
  errors: DeepMap<FieldValues, FieldError>
}

export const AddressForm = ({ errors, register }: AddressFormProps) => {
  return (
    <Box alignSelf="flex-start">
      <Text>Endereço de entrega</Text>
      <FormInput
        name="state"
        placeholder="Estado"
        {...register('deliveryAddress.state')}
        error={errors.deliveryAddress && errors.deliveryAddress.state}
        containerStyle={{ mb: '4' }}
      />

      <FormInput
        name="city"
        placeholder="Cidade"
        {...register('deliveryAddress.city')}
        error={errors.deliveryAddress && errors.deliveryAddress.city}
        containerStyle={{ mb: '4' }}
      />

      <FormInput
        name="street"
        placeholder="Endereço"
        {...register('deliveryAddress.street')}
        error={errors.deliveryAddress && errors.deliveryAddress.street}
        containerStyle={{ mb: '4' }}
      />

      <FormInput
        name="neighborhood"
        placeholder="Bairro"
        {...register('deliveryAddress.neighborhood')}
        error={errors.deliveryAddress && errors.deliveryAddress.neighborhood}
        containerStyle={{ mb: '4' }}
      />

      <FormInput
        name="number"
        placeholder="Numero"
        {...register('deliveryAddress.number')}
        error={errors.deliveryAddress && errors.deliveryAddress.number}
        containerStyle={{ mb: '4' }}
      />

      <FormInput
        name="cep"
        placeholder="Cep"
        {...register('deliveryAddress.cep')}
        error={errors.deliveryAddress && errors.deliveryAddress.cep}
        containerStyle={{ mb: '4' }}
      />

      <Checkbox colorScheme="green" defaultIsChecked>
        Salvar como padrão para as próximas compras
      </Checkbox>
    </Box>
  )
}

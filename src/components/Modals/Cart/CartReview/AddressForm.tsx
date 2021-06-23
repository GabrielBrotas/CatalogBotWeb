import React from 'react'
import { Box, Checkbox, Flex, Text } from '@chakra-ui/react'
import { FormInput } from '../../../Form/input'
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form'

interface AddressFormProps {
  register: UseFormRegister<FieldValues>
  errors: DeepMap<FieldValues, FieldError>
}

export const AddressForm = ({ errors, register }: AddressFormProps) => {
  return (
    <Box alignSelf="flex-start" mt="4">
      <Text fontSize="x-large" fontWeight="medium" mb="4">
        Endereço de entrega
      </Text>
      <FormInput
        name="state"
        placeholder="Estado"
        {...register('deliveryAddress.state')}
        error={errors.deliveryAddress && errors.deliveryAddress.state}
        containerStyle={{ mb: '4' }}
        secondary
      />

      <FormInput
        name="city"
        placeholder="Cidade"
        {...register('deliveryAddress.city')}
        error={errors.deliveryAddress && errors.deliveryAddress.city}
        containerStyle={{ mb: '4' }}
        secondary
      />

      <FormInput
        name="street"
        placeholder="Endereço"
        {...register('deliveryAddress.street')}
        error={errors.deliveryAddress && errors.deliveryAddress.street}
        containerStyle={{ mb: '4' }}
        secondary
      />

      <FormInput
        name="neighborhood"
        placeholder="Bairro"
        {...register('deliveryAddress.neighborhood')}
        error={errors.deliveryAddress && errors.deliveryAddress.neighborhood}
        containerStyle={{ mb: '4' }}
        secondary
      />

      <FormInput
        name="number"
        placeholder="Numero"
        {...register('deliveryAddress.number')}
        error={errors.deliveryAddress && errors.deliveryAddress.number}
        containerStyle={{ mb: '4' }}
        secondary
      />

      <FormInput
        name="cep"
        placeholder="Cep"
        {...register('deliveryAddress.cep')}
        error={errors.deliveryAddress && errors.deliveryAddress.cep}
        containerStyle={{ mb: '4' }}
        secondary
      />

      <Checkbox
        colorScheme="blue"
        defaultIsChecked
        size="md"
        mr="2"
        mb="4"
        {...register('saveAddressAsDefault')}
      >
        Salvar este endereço como padrão para as próximas compras
      </Checkbox>
    </Box>
  )
}

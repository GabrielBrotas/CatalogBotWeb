import React from 'react'
import { FormControl, Text } from '@chakra-ui/react'

import { FormInput } from '../../Form/input'
import { Button } from '../../Form/button'
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form'

interface RegisterFormProps {
  register: UseFormRegister<FieldValues>
  errors: DeepMap<FieldValues, FieldError>
  isSubmitting: boolean
  setFormType: React.Dispatch<React.SetStateAction<'Register' | 'Login'>>
}

export const RegisterForm = ({
  register,
  errors,
  isSubmitting,
  setFormType,
}: RegisterFormProps) => {
  return (
    <>
      <Text fontSize="lg" my="4" textAlign="center">
        Faça seu cadastro
      </Text>
      <FormControl isInvalid={errors.name}>
        <FormInput
          name="name"
          placeholder="Nome"
          {...register('name')}
          error={errors.name}
          containerStyle={{ mb: '4' }}
        />

        <FormInput
          name="email"
          placeholder="E-mail"
          {...register('email')}
          error={errors.email}
          containerStyle={{ mb: '4' }}
        />

        <FormInput
          name="password"
          placeholder="Senha"
          type="password"
          {...register('password')}
          error={errors.password}
          containerStyle={{ mb: '4' }}
        />

        <FormInput
          name="cellphone"
          placeholder="Telefone"
          {...register('cellphone')}
          error={errors.cellphone}
          containerStyle={{ mb: '4' }}
        />

        <FormInput
          name="state"
          placeholder="Estado"
          {...register('defaultAddress.state')}
          error={errors.defaultAddress && errors.defaultAddress.state}
          containerStyle={{ mb: '4' }}
        />

        <FormInput
          name="city"
          placeholder="Cidade"
          {...register('defaultAddress.city')}
          error={errors.defaultAddress && errors.defaultAddress.city}
          containerStyle={{ mb: '4' }}
        />

        <FormInput
          name="street"
          placeholder="Endereço"
          {...register('defaultAddress.street')}
          error={errors.defaultAddress && errors.defaultAddress.street}
          containerStyle={{ mb: '4' }}
        />

        <FormInput
          name="neighborhood"
          placeholder="Bairro"
          {...register('defaultAddress.neighborhood')}
          error={errors.defaultAddress && errors.defaultAddress.neighborhood}
          containerStyle={{ mb: '4' }}
        />

        <FormInput
          name="number"
          placeholder="Numero"
          {...register('defaultAddress.number')}
          error={errors.defaultAddress && errors.defaultAddress.number}
          containerStyle={{ mb: '4' }}
        />

        <FormInput
          name="cep"
          placeholder="Cep"
          {...register('defaultAddress.cep')}
          error={errors.defaultAddress && errors.defaultAddress.cep}
          containerStyle={{ mb: '4' }}
        />
      </FormControl>

      <Button mt={4} w="100%" isLoading={isSubmitting} type="submit">
        Cadastrar
      </Button>

      <Text mt={4} w="100%" onClick={() => setFormType('Login')}>
        Já tenho uma conta
      </Text>
    </>
  )
}

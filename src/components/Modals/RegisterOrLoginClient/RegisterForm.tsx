import React, { useState } from 'react'
import { FormControl, Text } from '@chakra-ui/react'

import { FormInput } from '../../Form/input'
import { FormButton } from '../../Form/button'
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form'
import { useClientAuth } from '../../../contexts/AuthClient'

interface RegisterFormProps {
  register: UseFormRegister<FieldValues>
  errors: DeepMap<FieldValues, FieldError>
  isSubmitting: boolean
}

export const RegisterForm = ({ register, errors, isSubmitting }: RegisterFormProps) => {
  const { setFormType } = useClientAuth()

  return (
    <>
      <Text fontSize="xl" my="4" textAlign="center">
        Faça seu cadastro
      </Text>
      <FormControl isInvalid={errors.name}>
        <FormInput
          secondary={true}
          name="name"
          placeholder="Nome"
          {...register('name')}
          error={errors.name}
          containerStyle={{ mb: '4' }}
        />

        <FormInput
          secondary={true}
          name="email"
          placeholder="E-mail"
          {...register('email')}
          error={errors.email}
          containerStyle={{ mb: '4' }}
        />

        <FormInput
          secondary={true}
          name="password"
          placeholder="Senha"
          type="password"
          {...register('password')}
          error={errors.password}
          containerStyle={{ mb: '4' }}
        />

        <FormInput
          secondary={true}
          name="cellphone"
          placeholder="Telefone"
          {...register('cellphone')}
          error={errors.cellphone}
          containerStyle={{ mb: '4' }}
        />
      </FormControl>

      <FormButton secondary={true} mt={4} w="100%" isLoading={isSubmitting} type="submit">
        Cadastrar
      </FormButton>

      <Text cursor="pointer" fontSize="lg" mt={4} w="100%" onClick={() => setFormType('login')}>
        Já tenho uma conta
      </Text>
    </>
  )
}

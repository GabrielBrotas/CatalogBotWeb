import React from 'react'
import { FormControl, Text } from '@chakra-ui/react'

import { FormInput } from '../../Form/input'
import { FormButton } from '../../Form/button'
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form'
import { useClientAuth } from '../../../contexts/AuthClient'

interface LoginFormProps {
  register: UseFormRegister<FieldValues>
  errors: DeepMap<FieldValues, FieldError>
  isSubmitting: boolean
}

export const LoginForm = ({ register, errors, isSubmitting }: LoginFormProps) => {
  const { setFormType } = useClientAuth()
  return (
    <>
      <Text fontSize="xl" my="4" textAlign="center">
        Faça seu Login
      </Text>
      <FormControl isInvalid={errors.name}>
        <FormInput
          name="user"
          placeholder="E-mail ou telefone"
          {...register('user')}
          error={errors.user}
          containerStyle={{ mb: '4' }}
          secondary={true}
        />

        <FormInput
          name="password"
          placeholder="Senha"
          type="password"
          {...register('password')}
          error={errors.password}
          containerStyle={{ mb: '4' }}
          secondary={true}
        />
      </FormControl>

      <FormButton secondary={true} mt={4} w="100%" isLoading={isSubmitting} type="submit">
        Login
      </FormButton>

      <Text cursor="pointer" fontSize="lg" mt={4} w="100%" onClick={() => setFormType('register')}>
        Não tenho uma conta
      </Text>
    </>
  )
}

import React from 'react'
import { FormControl, Text } from '@chakra-ui/react'

import { FormInput } from '../../Form/input'
import { Button } from '../../Form/button'
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form'

interface LoginFormProps {
  register: UseFormRegister<FieldValues>
  errors: DeepMap<FieldValues, FieldError>
  isSubmitting: boolean
  setFormType: React.Dispatch<React.SetStateAction<'Register' | 'Login'>>
}

export const LoginForm = ({ register, errors, isSubmitting, setFormType }: LoginFormProps) => {
  return (
    <>
      <Text fontSize="lg" my="4" textAlign="center">
        Faça seu Login
      </Text>
      <FormControl isInvalid={errors.name}>
        <FormInput
          name="user"
          placeholder="E-mail ou telefone"
          {...register('user')}
          error={errors.user}
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
      </FormControl>

      <Button mt={4} w="100%" isLoading={isSubmitting} type="submit">
        Login
      </Button>

      <Text mt={4} w="100%" onClick={() => setFormType('Register')}>
        Não tennho uma conta
      </Text>
    </>
  )
}

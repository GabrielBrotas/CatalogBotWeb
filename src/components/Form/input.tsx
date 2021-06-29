import React, { forwardRef } from 'react'

import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormLabel,
  Input as CharkaInput,
  InputProps as CharkaInputProps,
} from '@chakra-ui/react'
import { FieldError } from 'react-hook-form'

interface InputProps extends CharkaInputProps {
  name: string
  label?: string
  error?: FieldError
  containerStyle?: FormControlProps
  secondary?: boolean
}

const InputContainer: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error = null, containerStyle, secondary = false, ...rest }: InputProps,
  ref
) => {
  return (
    <FormControl isInvalid={!!error} {...containerStyle}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <CharkaInput
        id={name}
        name={name}
        focusBorderColor={secondary ? 'blue.500' : 'pink.500'}
        bgColor={secondary ? 'gray.50' : 'gray.700'}
        variant="outline"
        _hover={secondary ? { bgColor: 'gray.75' } : { bgColor: 'gray.800' }}
        size="lg"
        ref={ref}
        {...rest}
      />

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

export const FormInput = forwardRef(InputContainer)

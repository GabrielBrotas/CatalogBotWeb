import React, { forwardRef } from 'react'

import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormLabel,
  Textarea as ChakraTextArea,
  TextareaProps as CharkaTextareaProps,
} from '@chakra-ui/react'
import { FieldError } from 'react-hook-form'

interface TextareaProps extends CharkaTextareaProps {
  name: string
  label?: string
  error?: FieldError
  containerStyle?: FormControlProps
  secondary?: boolean
}

const TextAreaContainer: React.ForwardRefRenderFunction<HTMLTextAreaElement, TextareaProps> = (
  { name, label, error = null, containerStyle, secondary, ...rest }: TextareaProps,
  ref
) => {
  return (
    <FormControl isInvalid={!!error} {...containerStyle}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <ChakraTextArea
        id={name}
        name={name}
        variant="outline"
        focusBorderColor={secondary ? 'blue.500' : 'pink.500'}
        bgColor={secondary ? 'gray.50' : 'gray.700'}
        _hover={secondary ? { bgColor: 'gray.100' } : { bgColor: 'gray.800' }}
        size="lg"
        ref={ref}
        {...rest}
      />

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

export const FormTextArea = forwardRef(TextAreaContainer)

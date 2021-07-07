import React, { forwardRef } from 'react'
import InputMask from 'react-input-mask'

import {
  Box,
  Input as ChakraInput,
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react'
import { FieldError } from 'react-hook-form'

interface InputProps {
  name: string
  label?: string
  placeholder?: string
  error?: FieldError
  containerStyle?: FormControlProps
  defaultValue?: number
  secondary?: boolean
}

const CellphoneMaskedInput: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {
    name,
    label,
    placeholder,
    error = null,
    containerStyle,
    secondary = false,
    ...rest
  }: InputProps,
  ref
) => {
  return (
    <FormControl isInvalid={!!error} {...containerStyle}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <Box>
        <InputMask mask="(99) 9 9999-9999" {...rest}>
          {(inputProps) => (
            <ChakraInput
              id={name}
              name={name}
              placeholder={placeholder}
              type="tel"
              disableUnderline
              ref={ref}
              focusBorderColor={secondary ? 'blue.500' : 'pink.500'}
              bgColor={secondary ? 'gray.50' : 'gray.700'}
              variant="outline"
              _hover={secondary ? { bgColor: 'gray.75' } : { bgColor: 'gray.800' }}
              size="lg"
              {...inputProps}
            />
          )}
        </InputMask>
      </Box>

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

export const FormCellphoneMaskedInput = forwardRef(CellphoneMaskedInput)

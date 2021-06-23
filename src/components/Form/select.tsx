import React, { forwardRef } from 'react'

import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormLabel,
  Select as ChakraSelect,
  SelectProps as CharkaSelectProps,
} from '@chakra-ui/react'
import { FieldError } from 'react-hook-form'

interface SelectProps extends CharkaSelectProps {
  name: string
  placeholder?: string
  label?: string
  error?: FieldError
  containerStyle?: FormControlProps
  options: { value: string | number; label: string }[]
}

const SelectContainer: React.ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = (
  { name, placeholder, label, error = null, containerStyle, options, ...rest }: SelectProps,
  ref
) => {
  return (
    <FormControl isInvalid={!!error} {...containerStyle}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <ChakraSelect
        id={name}
        name={name}
        focusBorderColor="pink.500"
        bgColor="gray.700"
        bg="gray.700"
        variant="outline"
        _hover={{ bgColor: 'gray.800' }}
        size="lg"
        ref={ref}
        placeholder={placeholder}
        {...rest}
      >
        {options.map((option, index) => (
          <option key={index} style={{ backgroundColor: '#1F2029' }} value={option.value}>
            {option.label}
          </option>
        ))}
      </ChakraSelect>

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

export const FormSelect = forwardRef(SelectContainer)

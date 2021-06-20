import React, { forwardRef } from 'react'
import CurrencyInput from 'react-currency-masked-input'

import { Box, FormControl, FormControlProps, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import { FieldError } from 'react-hook-form'

interface InputProps {
  name: string
  label?: string
  error?: FieldError
  containerStyle?: FormControlProps
  defaultValue?: number
}

const PriceMaskedInputContainer: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error = null, containerStyle, defaultValue = 0.0, ...rest }: InputProps,
  ref
) => {
  return (
    <FormControl isInvalid={!!error} {...containerStyle}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <div>
        <Box
          id={name}
          name={name}
          borderWidth="1px"
          borderColor={'gray.300'}
          focusBorderColor="pink.500"
          bgColor="gray.700"
          variant="outline"
          _hover={{ bgColor: 'gray.800' }}
          size="lg"
          borderRadius="md"
          padding="3"
          display="flex"
        >
          <span>R$ </span>
          <CurrencyInput
            id={name}
            name={name}
            ref={ref}
            style={{ width: '100%', marginLeft: '.5rem', background: 'transparent' }}
            defaultValue={String(defaultValue)}
            {...rest}
          />
        </Box>
      </div>

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

export const FormPriceMaskedInput = forwardRef(PriceMaskedInputContainer)

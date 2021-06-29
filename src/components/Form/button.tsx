import React from 'react'
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react'

interface ButtonProps extends ChakraButtonProps {
  isSubmitting?: boolean
  secondary?: boolean
}

export const FormButton: React.FC<ButtonProps> = ({
  children,
  isSubmitting,
  secondary = false,
  ...rest
}) => (
  <ChakraButton
    colorScheme={secondary ? 'blue' : 'teal'}
    isLoading={isSubmitting}
    {...rest}
    disabled={isSubmitting}
  >
    {children}
  </ChakraButton>
)

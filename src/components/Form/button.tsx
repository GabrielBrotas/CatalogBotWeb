import React from 'react';
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';

interface ButtonProps extends ChakraButtonProps {
  isSubmitting?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isSubmitting,
  ...rest
}) => (
  <ChakraButton
    colorScheme="teal"
    isLoading={isSubmitting}
    {...rest}
  >
    {children}
  </ChakraButton>
);

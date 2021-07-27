import React from 'react'
import { Flex, Box, Text } from '@chakra-ui/react'
import { FormTextArea } from '../../../components/Form/textarea'
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form'

interface CardMessageProps {
  index: string
  text?: string
  readOnly?: boolean
  title?: string
  register?: UseFormRegister<any>
  errors?: DeepMap<FieldValues, FieldError>
}

export const CardMessage = ({
  index,
  text,
  readOnly = true,
  title = null,
  errors,
  register,
}: CardMessageProps) => {
  return (
    <Flex w="full" flexDir="column">
      {title && <Text fontSize="lg">{title}</Text>}
      <Flex w="full">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          // py="3"
          // px="4"
          minW="16"
          maxW="16"
          // h="16"
          bg="gray.700"
          marginRight={4}
          borderRadius="lg"
          mb={1}
          w="full"
        >
          <Text color="gray.300" fontSize="md">
            {index}
          </Text>
        </Box>

        {readOnly ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p="3"
            bg="gray.700"
            marginRight={4}
            borderRadius="lg"
            mb={1}
          >
            <Text color="gray.300" fontSize="md">
              {text}
            </Text>
          </Box>
        ) : (
          <FormTextArea name={index} {...register(String(index))} error={errors[index]} />
        )}
      </Flex>
    </Flex>
  )
}

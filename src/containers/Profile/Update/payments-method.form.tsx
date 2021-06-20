import React from 'react'
import { Checkbox, Flex, VStack, Text } from '@chakra-ui/react'
import { UseFormRegister } from 'react-hook-form'
import {
  CompanyPaymentMethods,
  CompanyWorkTime,
} from '../../../services/apiFunctions/companies/company/types'

interface CompanyPaymentMethodsFormProps {
  register: UseFormRegister<{
    name: string
    shortDescription: string
    workTime: CompanyWorkTime[]
    acceptedPaymentMethods: CompanyPaymentMethods
  }>
}

export const CompanyPaymentMethodsForm = ({ register }: CompanyPaymentMethodsFormProps) => {
  return (
    <Flex w="100%" flexDir="column" mt={10}>
      <Text color="gray.300" fontSize="2xl" mb="2">
        Formas de Pagamento
      </Text>

      <VStack alignItems="flex-start">
        <Checkbox size="md" colorScheme="green" {...register('acceptedPaymentMethods.money')}>
          Dinheiro
        </Checkbox>
        <Checkbox size="md" colorScheme="green" {...register('acceptedPaymentMethods.pix')}>
          Pix
        </Checkbox>
        <Checkbox size="md" colorScheme="green" {...register('acceptedPaymentMethods.debit')}>
          Débito
        </Checkbox>
        <Checkbox size="md" colorScheme="green" {...register('acceptedPaymentMethods.creditCard')}>
          Cartão de crédito
        </Checkbox>
        <Checkbox size="md" colorScheme="green" {...register('acceptedPaymentMethods.boleto')}>
          Boleto
        </Checkbox>
      </VStack>
    </Flex>
  )
}

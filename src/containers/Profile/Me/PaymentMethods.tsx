import React from 'react'
import { Flex, Text, UnorderedList, ListItem } from '@chakra-ui/react'
import { CompanyPaymentMethods } from '../../../services/apiFunctions/companies/company/types'
import { FORMAT_PAYMENT } from '../../../utils/formatedPaymentsMethod'

interface WorkTimeProps {
  paymentMethods: CompanyPaymentMethods
}

export const PaymentMethods = ({ paymentMethods }: WorkTimeProps) => {
  return (
    <Flex w="100%" flexDir="column" mt={10}>
      <Text color="gray.300" fontSize="2xl">
        Formas de Pagamento
      </Text>

      {Object.keys(paymentMethods).map(
        (method) =>
          paymentMethods[method] && (
            <UnorderedList key={method}>
              <ListItem>{FORMAT_PAYMENT[method]}</ListItem>
            </UnorderedList>
          )
      )}
    </Flex>
  )
}

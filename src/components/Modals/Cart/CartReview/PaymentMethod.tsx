import React from 'react'
import { Box, Radio, RadioGroup, VStack, Text } from '@chakra-ui/react'
import { CompanyPaymentMethods } from '../../../../services/apiFunctions/companies/company/types'
import { FORMAT_PAYMENT } from '../../../../utils/dataFormat'

interface PaymentMethodProps {
  paymentMethod: string
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>
  acceptedPaymentMethods: CompanyPaymentMethods
}

export const PaymentMethod = ({
  acceptedPaymentMethods,
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodProps) => {
  return (
    <Box alignSelf="flex-start" mb="4">
      <Text fontSize="x-large" fontWeight="medium" mb="4">
        Forma de Pagamento
      </Text>
      <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
        <VStack alignItems="flex-start">
          {Object.keys(acceptedPaymentMethods).map((paymentMethod) => (
            <Radio key={paymentMethod} value={paymentMethod} size="lg">
              {FORMAT_PAYMENT[paymentMethod]}
            </Radio>
          ))}
        </VStack>
      </RadioGroup>
    </Box>
  )
}

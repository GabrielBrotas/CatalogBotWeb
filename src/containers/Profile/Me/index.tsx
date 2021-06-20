import React from 'react'
import Link from 'next/link'
import { RiEditLine } from 'react-icons/ri'
import { Box, Button, Flex, Heading, Icon } from '@chakra-ui/react'

import { CompanyHeader } from '../../../components/Headers/CompanyHeader'
import { Sidebar } from '../../../components/Sidebar'
import { WorkTime } from './WorkTime'
import { HeaderInfo } from './HeaderInfo'
import { CompanyBenefitsTag } from '../../../components/Tags/companyBenefitsTag'
import { ProfileProps } from '../../../pages/profile'
import { PaymentMethods } from './PaymentMethods'

export const ProfileContainer = ({ company }: ProfileProps) => {
  return (
    <Box>
      <CompanyHeader />

      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Meu perfil
            </Heading>

            <Link href="/profile/update" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiEditLine} fontSize="20" />}
              >
                Editar
              </Button>
            </Link>
          </Flex>

          <Box>
            <HeaderInfo
              name={company.name}
              email={company.email}
              description={company?.shortDescription}
              mainImageUrl={company.mainImageUrl}
            />
            <CompanyBenefitsTag tags={company.benefits} />
            <WorkTime workTime={company.workTime} />
            <PaymentMethods paymentMethods={company.acceptedPaymentMethods} />
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}

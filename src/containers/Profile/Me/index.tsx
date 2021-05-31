import React from 'react';
import { Box, Button, Flex, Heading, Icon } from '@chakra-ui/react';
import { Header } from '../../../components/Header';
import { Sidebar } from '../../../components/Sidebar';
import { RiEditLine } from 'react-icons/ri';
import Link from 'next/link';
import { WorkTime } from './WorkTime';
import { HeaderInfo } from './HeaderInfo';
import { CompanyBenefitsTag } from '../../../components/Tags/companyBenefitsTag';

export const ProfileContainer = () => {
  return (
    <Box>
      <Header />

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
            <HeaderInfo />
            <CompanyBenefitsTag tags={['Entrega gratis']} canRemove={true} />
            <WorkTime />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

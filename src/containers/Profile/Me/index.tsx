import React from 'react';
import {
  Box,
  Button,
  Image,
  Flex,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useBreakpointValue,
  WrapItem,
  Avatar,
  Tag,
  SimpleGrid,
  Grid,
} from '@chakra-ui/react';
import { Header } from '../../../components/Header';
import { Sidebar } from '../../../components/Sidebar';
import { RiAddLine, RiEditLine, RiPencilLine } from 'react-icons/ri';
import { Pagination } from '../../../components/Pagination';
import Link from 'next/link';
import { WorkTime } from './WorkTime';
import { Benefits } from './Benefits';
import { HeaderInfo } from './HeaderInfo';

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
            <Benefits />
            <WorkTime />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

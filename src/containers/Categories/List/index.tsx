import React from 'react';
import {
  Box,
  Button,
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
} from '@chakra-ui/react';
import { Header } from '../../../components/Header';
import { Sidebar } from '../../../components/Sidebar';
import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import { Pagination } from '../../../components/Pagination';
import Link from 'next/link';

export const CategoriesContainer = () => {
  const mobileView = useBreakpointValue({
    base: true,
    lg: false,
  });

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Categorias
            </Heading>

            <Link href="/categories/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar nova
              </Button>
            </Link>
          </Flex>

          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Criada em</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td>
                  <Text fontWeight="bold">Nome do produto</Text>
                </Td>
                <Td>
                  <Text fontSize="sm">tal diia</Text>
                </Td>

                <Td>
                  <Link href="/categories/edit/:id" passHref>
                    <Button
                      as="a"
                      size="sm"
                      fontSize="sm"
                      colorScheme="purple"
                      leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                    >
                      Editar
                    </Button>
                  </Link>
                  <Button
                    marginLeft="4"
                    as="a"
                    size="sm"
                    fontSize="sm"
                    colorScheme="red"
                    leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                  >
                    Deletar
                  </Button>
                </Td>
              </Tr>
            </Tbody>
          </Table>

          <Pagination />
        </Box>
      </Flex>
    </Box>
  );
};
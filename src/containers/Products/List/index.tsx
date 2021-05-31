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
} from '@chakra-ui/react';
import { Header } from '../../../components/Header';
import { Sidebar } from '../../../components/Sidebar';
import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import { Pagination } from '../../../components/Pagination';
import Link from 'next/link';

export const ProductsContainer = () => {
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
              Produtos
            </Heading>

            <Link href="/products/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar novo
              </Button>
            </Link>
          </Flex>

          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th>Foto</Th>
                <Th>Nome</Th>
                <Th>Preço</Th>
                <Th>Categoria</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td px="6">
                  <Image
                    src="/images/default-picture.jpg"
                    alt="produto"
                    boxSize="50px"
                    objectFit="cover"
                  />
                </Td>
                <Td>
                  <Box>
                    <Text fontWeight="bold">Nome do produto</Text>
                    <Text fontSize="sm">descriçao do protuosoad </Text>
                  </Box>
                </Td>
                <Td>
                  <Text fontSize="sm">R$ 50,99</Text>
                </Td>
                <Td>
                  <Text fontSize="sm">Bebida</Text>
                </Td>

                <Td>
                  <Link href="/products/edit/:id" passHref>
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

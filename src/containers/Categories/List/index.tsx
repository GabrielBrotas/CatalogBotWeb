import React, { useState } from 'react'
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
} from '@chakra-ui/react'
import { Header } from '../../../components/Header'
import { Sidebar } from '../../../components/Sidebar'
import { RiAddLine, RiPencilLine } from 'react-icons/ri'
import { Pagination } from '../../../components/Pagination'
import Link from 'next/link'
import { CategoriesProps } from '../../../pages/categories'
import { deleteCategory } from '../../../services/apiFunctions/categories'
import { useAlertModal } from '../../../contexts/AlertModal'
import { useToast } from '../../../contexts/Toast'

export const CategoriesContainer = ({ categories }: CategoriesProps) => {
  const [companyCategories, setCompanyCategories] = useState(categories)

  const { handleOpenAlertModal } = useAlertModal()
  const { addToast } = useToast()

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      handleOpenAlertModal({
        title: 'Deletar Categoria',
        description: 'Você tem certeza que deseja deletar essa categoria?',
        onConfirm: async () => {
          await deleteCategory(categoryId)
          setCompanyCategories(companyCategories.filter((category) => category._id !== categoryId))
          addToast({
            title: 'Categoria removida com sucesso',
            status: 'info',
          })
        },
      })
    } catch (err) {
      addToast({
        title: 'Algo deu errado!',
        description: 'Desculpe, tente novamente mais tarde',
        status: 'error',
      })
    }
  }

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
                <Th textAlign="center">Nome</Th>
                <Th textAlign="center">Criada em</Th>
                <Th textAlign="center">Ações</Th>
              </Tr>
            </Thead>

            <Tbody>
              {companyCategories.map((category) => (
                <Tr key={category._id}>
                  <Td textAlign="center">
                    <Text fontWeight="bold">{category.name}</Text>
                  </Td>
                  <Td textAlign="center">
                    <Text fontSize="sm">{category.dateFormated}</Text>
                  </Td>

                  <Td textAlign="center">
                    <Link href={`/categories/edit/${category._id}`} passHref>
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
                      cursor="pointer"
                      marginLeft="4"
                      as="a"
                      size="sm"
                      fontSize="sm"
                      colorScheme="red"
                      leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      Deletar
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Pagination />
        </Box>
      </Flex>
    </Box>
  )
}

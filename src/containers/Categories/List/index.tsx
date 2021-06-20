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
  Spinner,
  useBreakpointValue,
} from '@chakra-ui/react'
import { CompanyHeader } from '../../../components/Headers/CompanyHeader'
import { Sidebar } from '../../../components/Sidebar'
import { RiAddLine, RiPencilLine } from 'react-icons/ri'
import { Pagination } from '../../../components/Pagination'
import Link from 'next/link'
import { CategoriesProps } from '../../../pages/categories'
import { deleteCategory, getCategories } from '../../../services/apiFunctions/companies/categories'
import { useAlertModal } from '../../../contexts/AlertModal'
import { useToast } from '../../../contexts/Toast'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import { queryClient } from '../../../services/queryClient'
import { useCompanyAuth } from '../../../contexts/AuthCompany'

export const CategoriesContainer = (props: CategoriesProps) => {
  const [page, setPage] = useState(1)
  const { company } = useCompanyAuth()

  const isMobileView = useBreakpointValue({
    base: true,
    md: false,
    lg: false,
  })

  const {
    data: { results, total, next, previous },
    isLoading,
  } = useQuery(
    ['categories', { page }],
    async () => {
      const { results, total, next, previous } = await getCategories({
        companyId: company._id,
        page,
      })

      const categoriesFormated = results.map((category) => ({
        ...category,
        dateFormated: dayjs(category.created_at).format('DD/MM/YYYY'),
      }))

      setCompanyCategories(categoriesFormated)
      return { results: categoriesFormated, total, next, previous }
    },
    {
      initialData: {
        results: props.categories,
        previous: props.previous,
        next: props.next,
        total: props.total,
      },
    }
  )

  const [companyCategories, setCompanyCategories] = useState(results)

  const { handleOpenAlertModal } = useAlertModal()
  const { addToast } = useToast()

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      queryClient.invalidateQueries('categories')
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
      <CompanyHeader />

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

          {isLoading ? (
            <Box textAlign="center">
              <Spinner size="xl" />
            </Box>
          ) : (
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
                      <Flex
                        flexDir={isMobileView ? 'column' : 'row'}
                        alignItems="center"
                        justifyContent="center"
                      >
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
                          marginLeft={isMobileView ? 0 : 4}
                          marginTop={isMobileView ? 4 : 0}
                          as="a"
                          size="sm"
                          fontSize="sm"
                          colorScheme="red"
                          leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Deletar
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}

          <Pagination
            currentPage={page}
            totalCountOfRegisters={companyCategories.length}
            onPageChange={setPage}
          />
        </Box>
      </Flex>
    </Box>
  )
}

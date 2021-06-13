import React, { useState } from 'react'
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
  Spinner,
} from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { RiAddLine, RiPencilLine } from 'react-icons/ri'
import dayjs from 'dayjs'

import { Header } from '../../../components/Header'
import { Sidebar } from '../../../components/Sidebar'
import { Pagination } from '../../../components/Pagination'
import Link from 'next/link'
import { ProductsProps } from '../../../pages/products'
import { useAlertModal } from '../../../contexts/AlertModal'
import { useToast } from '../../../contexts/Toast'
import { deleteProduct, getProducts } from '../../../services/apiFunctions/companies/products'
import { queryClient } from '../../../services/queryClient'
import { useCompanyAuth } from '../../../contexts/AuthCompany'

export const ProductsContainer = (props: ProductsProps) => {
  const [page, setPage] = useState(1)
  const { company } = useCompanyAuth()

  const {
    data: { results, total, next, previous },
    isLoading,
    isFetching,
  } = useQuery(
    ['products', { page }],
    async () => {
      const { results, total, next, previous } = await getProducts({ page, companyId: company._id })

      const formatterPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })

      const resultsFormated = results.map((product) => ({
        ...product,
        dateFormated: dayjs(product.created_at).format('DD/MM/YYYY'),
        priceFormated: formatterPrice.format(product.price),
      }))

      setCompanyProducts(resultsFormated)
      return { results: resultsFormated, total, next, previous }
    },
    {
      initialData: {
        results: props.products,
        previous: props.previous,
        next: props.next,
        total: props.total,
      },
    }
  )
  const [companyProducts, setCompanyProducts] = useState(results)

  const { handleOpenAlertModal } = useAlertModal()
  const { addToast } = useToast()

  const handleDeleteProduct = async (productId: string) => {
    try {
      queryClient.invalidateQueries('products')
      handleOpenAlertModal({
        title: 'Deletar Protudo',
        description: 'Você tem certeza que deseja deletar este produto?',
        onConfirm: async () => {
          await deleteProduct(productId)
          setCompanyProducts(companyProducts.filter((product) => product._id !== productId))
          addToast({
            title: 'Produto removido com sucesso',
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

          {isLoading || isFetching ? (
            <Box textAlign="center">
              <Spinner size="xl" />
            </Box>
          ) : (
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
                {companyProducts.map((product) => (
                  <Tr key={product._id}>
                    <Td px="6">
                      <Image
                        src={product?.imageUrl}
                        alt={product.name}
                        boxSize="50px"
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/150"
                      />
                    </Td>
                    <Td>
                      <Box>
                        <Text fontWeight="bold">{product.name}</Text>
                        <Text fontSize="sm" isTruncated maxW="10rem">
                          {product.description}
                        </Text>
                      </Box>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{product.priceFormated}</Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm">
                        {product.category ? product.category.name : 'Categoria deletada!'}
                      </Text>
                    </Td>

                    <Td>
                      <Link href={`/products/edit/${product._id}`} passHref>
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
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Deletar
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}

          <Pagination currentPage={page} totalCountOfRegisters={total} onPageChange={setPage} />
        </Box>
      </Flex>
    </Box>
  )
}

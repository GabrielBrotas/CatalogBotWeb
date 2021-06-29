import React from 'react'
import Link from 'next/link'
import { RiPencilLine } from 'react-icons/ri'

import {
  Box,
  Button,
  Image,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Flex,
  useBreakpointValue,
  Tooltip,
} from '@chakra-ui/react'

import { ProductFormated } from '../../../pages/products'
import { useAlertModal } from '../../../contexts/Modals/AlertModal'
import { useToast } from '../../../contexts/Modals/Toast'
import { queryClient } from '../../../services/queryClient'
import { deleteProduct } from '../../../services/apiFunctions/companies/products'

interface ProductsTablesProps {
  companyProducts: ProductFormated[]
  setCompanyProducts: React.Dispatch<React.SetStateAction<ProductFormated[]>>
}

export const ProductsTable = ({ companyProducts, setCompanyProducts }: ProductsTablesProps) => {
  const { handleOpenAlertModal } = useAlertModal()
  const { addToast } = useToast()

  const isMobileView = useBreakpointValue({
    base: true,
    md: false,
    lg: false,
  })

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
    <Table colorScheme="whiteAlpha">
      <Thead>
        <Tr>
          <Th>Foto</Th>
          <Th>Nome</Th>
          {!isMobileView && (
            <>
              <Th>Categoria</Th>
              <Th>Preço</Th>
            </>
          )}
          <Th>Ações</Th>
        </Tr>
      </Thead>
      <Tbody>
        {companyProducts.map((product) => (
          <Tr key={product._id}>
            <Td minW="100px">
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

            {!isMobileView && (
              <>
                <Td>
                  <Text fontSize="sm">{product.priceFormated}</Text>
                </Td>
                <Td>
                  {product.category ? (
                    <Text fontSize="sm">{product.category.name}</Text>
                  ) : (
                    <Tooltip
                      label="Produtos sem categoria não vão aparecer no catálogo!"
                      aria-label="A tooltip"
                    >
                      <Text fontSize="sm" textColor="red.400">
                        Categoria excluida!
                      </Text>
                    </Tooltip>
                  )}
                </Td>
              </>
            )}

            <Td>
              <Flex
                flexDir={isMobileView ? 'column' : 'row'}
                alignItems="center"
                justifyContent="center"
              >
                <Link href={`/products/edit/${product._id}`} passHref>
                  <Button
                    as="a"
                    size="sm"
                    fontSize="sm"
                    colorScheme="purple"
                    leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                    w="6rem"
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
                  onClick={() => handleDeleteProduct(product._id)}
                  w="rem"
                >
                  Deletar
                </Button>
              </Flex>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

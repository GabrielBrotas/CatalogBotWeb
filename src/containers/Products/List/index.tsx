import React, { useState } from 'react'
import { Box, Button, Flex, Heading, Icon, Spinner } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { RiAddLine } from 'react-icons/ri'
import dayjs from 'dayjs'

import { CompanyHeader } from '../../../components/Headers/CompanyHeader'
import { Sidebar } from '../../../components/Sidebar'
import { Pagination } from '../../../components/Pagination'
import Link from 'next/link'
import { ProductsProps } from '../../../pages/products'
import { getProducts } from '../../../services/apiFunctions/companies/products'
import { useCompanyAuth } from '../../../contexts/AuthCompany'
import { ProductsTable } from './table'

export const ProductsContainer = (props: ProductsProps) => {
  const [page, setPage] = useState(1)
  const { company } = useCompanyAuth()

  const {
    data: { results, total, next, previous },
    isLoading,
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

  return (
    <Box w={['max-content', '100%']}>
      <CompanyHeader />

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

          {isLoading ? (
            <Box textAlign="center">
              <Spinner size="xl" />
            </Box>
          ) : (
            <ProductsTable
              companyProducts={companyProducts}
              setCompanyProducts={setCompanyProducts}
            />
          )}

          <Pagination currentPage={page} totalCountOfRegisters={total} onPageChange={setPage} />
        </Box>
      </Flex>
    </Box>
  )
}

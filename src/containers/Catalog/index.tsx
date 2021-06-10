import React, { Fragment, useCallback, useMemo } from 'react'
import {
  Avatar,
  Box,
  Text,
  Container,
  Flex,
  Image,
  Alert,
  AlertIcon,
  Heading,
  Divider,
} from '@chakra-ui/react'
import { CatalogProps } from '../../pages/catalog/[companyId]'

import { CompanyBenefitsTag } from '../../components/Tags/companyBenefitsTag'
import { useCatalogModal } from '../../contexts/CatalogModal'
import { Product } from '../../services/apiFunctions/products/types'

export const CatalogContainer = ({ company, productsAgrupedByCategory }: CatalogProps) => {
  const { handleOpenCatalogModal } = useCatalogModal()

  const isCompanyOpen = useMemo(() => {
    let open = false

    const today = new Date()
    const todayInfo = {
      day: today.getDay(),
      hours: today.getHours(),
      minutes: today.getMinutes(),
    }

    company.workTime.map((workDay) => {
      if (workDay.day === todayInfo.day) {
        const [fromHour, fromMinutes] = workDay.from.split(':')
        const [toHour, toMinutes] = workDay.to.split(':')

        if (
          String(todayInfo.hours) >= String(fromHour) &&
          String(todayInfo.hours) <= String(toHour) &&
          String(fromMinutes) >= String(fromMinutes)
        ) {
          open = true
        }
      }
    })

    return open
  }, [company.workTime])

  const handleOpenProductModal = useCallback(
    (product: Product) => {
      handleOpenCatalogModal({ type: 'product', product })
    },
    [handleOpenCatalogModal]
  )

  return (
    <Container maxW="container.xl" centerContent p="0.5" display="flex" flexDir="column">
      <Image
        w="full"
        h="15rem"
        objectFit="cover"
        src={company.mainImageUrl ? company.mainImageUrl : '/images/default-picture.jpg'}
        alt={company.name}
      />

      <Box padding="2" flex={1} display="flex" flexDir="column" mt={2} w="full" maxW="800px">
        <Flex alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Heading as="h4" size="md" isTruncated>
              {company.name}
            </Heading>
            <Text mt="1" maxW="40rem">
              {company.shortDescription}
            </Text>
          </Box>
          <Box ml="4">
            <Avatar size="lg" name={company.name} src={company.mainImageUrl} />
          </Box>
        </Flex>

        <CompanyBenefitsTag tags={company.benefits} />

        {!isCompanyOpen && (
          <Alert status="info" mt="6" textColor="gray.600">
            <AlertIcon />A empresa não está em funcionamento no momento
          </Alert>
        )}

        {productsAgrupedByCategory.map((productGroup) => (
          <Fragment key={productGroup.category}>
            <Box display="Flex" flexDir="column" mt="6">
              <Heading as="h4" size="md" isTruncated mb="4">
                {productGroup.category}
              </Heading>

              {productGroup.products.map((product) => (
                <Flex
                  key={product._id}
                  alignItems="center"
                  justifyContent="space-between"
                  my="4"
                  cursor="pointer"
                  onClick={() => handleOpenProductModal(product)}
                >
                  <Box flex={1}>
                    <Heading as="h5" size="sm" isTruncated>
                      {product.name}
                    </Heading>
                    <Text mt="1" maxW="40rem">
                      {product.description}
                    </Text>
                    <Text fontSize="lg">{product.priceFormated}</Text>
                  </Box>
                  <Image
                    boxSize="6rem"
                    name={product.name}
                    src={product.imageUrl ? product.imageUrl : '/images/default-picture.jpg'}
                  />
                </Flex>
              ))}
            </Box>

            <Divider />
          </Fragment>
        ))}
      </Box>
    </Container>
  )
}

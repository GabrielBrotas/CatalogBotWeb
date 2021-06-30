import React, { Fragment, useEffect, useMemo } from 'react'
import {
  Avatar,
  Box,
  Text,
  Container,
  Flex,
  Alert,
  AlertIcon,
  Heading,
  Divider,
} from '@chakra-ui/react'
import { CatalogProps } from '../../pages/catalog/[companyId]'

import { CompanyBenefitsTag } from '../../components/Tags/companyBenefitsTag'
import { useCart } from '../../contexts/Cart'
import { CatalogHeader } from '../../components/Headers/CatalogHeader'
import { AiOutlineShop } from 'react-icons/ai'
import { CatalogProduct } from '../../components/CatalogProduct'
import { addCompanyData } from '../../services/apiFunctions/clients/client'
import { useClientAuth } from '../../contexts/AuthClient'

export const CatalogContainer = ({ company, productsAgrupedByCategory }: CatalogProps) => {
  const { setCompany, cart } = useCart()
  const { client } = useClientAuth()

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

  useEffect(() => {
    setCompany(company)
  }, [company, setCompany])

  useEffect(() => {
    addCompanyData({
      companyId: company._id,
      type: 'view',
      ...(client && { clientId: client._id }),
    })
  }, [client, company._id])

  return (
    <Container
      centerContent
      display="flex"
      flexDir="column"
      maxHeight={cart ? (cart.orderProducts.length > 0 ? '91%' : '100%') : '100%'}
      maxW="800px"
      p="0"
    >
      <CatalogHeader />

      <Box padding="4" flex={1} display="flex" flexDir="column" mt={6} w="full">
        <Flex alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Heading as="h4" fontSize="x-large" isTruncated>
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

        <CompanyBenefitsTag tags={company.benefits} secondary />

        {!isCompanyOpen && (
          <Alert status="info" mt="6" textColor="gray.600">
            <AlertIcon />A empresa não está em funcionamento no momento
          </Alert>
        )}

        <Flex my="6">
          <AiOutlineShop size={25} />
          <Text ml="2" fontSize="xl" fontWeight="medium">
            Shopping
          </Text>
        </Flex>
        <Box
          bg="whiteAlpha.900"
          px="8"
          borderTopRadius="2xl"
          pb={cart ? (cart.orderProducts.length > 0 ? '5rem' : '2') : '2'}
        >
          {productsAgrupedByCategory.map((productGroup) => (
            <Fragment key={productGroup.category}>
              <Box display="Flex" flexDir="column" mt="4">
                <Heading as="h4" fontSize="x-large" isTruncated mb="2">
                  {productGroup.category}
                </Heading>
                <Divider />

                {productGroup.products.map((product) => (
                  <CatalogProduct key={product._id} product={product} />
                ))}
              </Box>
            </Fragment>
          ))}
        </Box>
      </Box>
    </Container>
  )
}

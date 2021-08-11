import React, { useEffect, useMemo } from 'react'
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
import { InView } from 'react-intersection-observer'

import { CompanyBenefitsTag } from '../../components/Tags/companyBenefitsTag'
import { useCart } from '../../contexts/Cart'
import { CatalogHeader } from '../../components/Headers/CatalogHeader'
import { AiOutlineShop } from 'react-icons/ai'
import { CatalogProduct } from '../../components/CatalogProduct'
import { addCompanyData } from '../../services/apiFunctions/clients/client'
import { useClientAuth } from '../../contexts/AuthClient'
import { useOrderModal } from '../../contexts/Modals/OrderModal'
import dayjs from 'dayjs'
import { currencyFormat } from '../../utils/dataFormat'
import { getTotalPriceFromOrderProduct } from '../../utils/maths'
import { getOrder } from '../../services/apiFunctions/clients/orders'

export const CatalogContainer = ({
  company,
  productsAgrupedByCategory,
  queryOrderID,
}: CatalogProps) => {
  const { setCompany, cart } = useCart()
  const { client, isAuthenticated, openModal } = useClientAuth()
  const { openOrderModal, setSelectedOrder } = useOrderModal()

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

  const [categoriesData, setCategoriesData] = React.useState(
    productsAgrupedByCategory.map((group) => ({ name: group.category, isActive: false }))
  )

  const [showNavCategories, setShowNavCategories] = React.useState(false)

  const handleElementInView = (category: string, inView: boolean) => {
    setCategoriesData((prevState) =>
      prevState.map((data) => (category === data.name ? { ...data, isActive: inView } : data))
    )
  }

  const isCompanyNameInScreen = (inView: boolean) => {
    setShowNavCategories(!inView)
  }

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

  useEffect(() => {
    if (queryOrderID && isAuthenticated) {
      getOrder({ orderId: queryOrderID })
        .then((order) => {
          setSelectedOrder({
            ...order,
            dateFormated: dayjs(order.created_at).format('DD/MM/YYYY - HH:mm'),
            totalPriceFormated: currencyFormat(Number(order.totalPrice)),
            orderProducts: order.orderProducts.map((orderProduct) => ({
              ...orderProduct,
              totalPriceFormated: currencyFormat(getTotalPriceFromOrderProduct(orderProduct)),
              product: {
                ...orderProduct.product,
                priceFormated: currencyFormat(orderProduct.product.price),
              },
              pickedOptions: orderProduct.pickedOptions.map((pickedOption) => ({
                ...pickedOption,
                optionAdditionals: pickedOption.optionAdditionals.map((optionAdditional) => ({
                  ...optionAdditional,
                  priceFormated: currencyFormat(Number(optionAdditional.price)),
                })),
              })),
            })),
          })
          openOrderModal()
        })
        .catch((err) => {
          console.log('get order err = ', err)
        })
    }
    if (queryOrderID && !isAuthenticated) {
      openModal({ type: 'login' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openOrderModal, queryOrderID, isAuthenticated, setSelectedOrder])

  return (
    <Container
      centerContent
      display="flex"
      flexDir="column"
      maxHeight={cart ? (cart.orderProducts.length > 0 ? '91%' : '100%') : '100%'}
      maxW="800px"
      p="0"
    >
      <CatalogHeader categoriesData={categoriesData} showNavCategories={showNavCategories} />

      <Box padding="4" flex={1} display="flex" flexDir="column" mt={20} w="full">
        <Flex alignItems="flex-start" justifyContent="space-between">
          <Box>
            <InView rootMargin="-30px 0px 0px 0px" onChange={isCompanyNameInScreen}>
              <Heading as="h4" fontSize="x-large" isTruncated>
                {company.name}
              </Heading>
            </InView>
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
            <InView
              key={productGroup.category}
              rootMargin="-135px 0px 0px 0px"
              onChange={(inView) => handleElementInView(productGroup.category, inView)}
            >
              <Box display="Flex" flexDir="column" mt="4" position="relative">
                <Box position="absolute" mt="-130px" id={`${productGroup.category}`} />
                <Heading as="h4" fontSize="x-large" isTruncated mb="2">
                  {productGroup.category}
                </Heading>
                <Divider />

                {productGroup.products.map((product) => (
                  <CatalogProduct key={product._id} product={product} />
                ))}
              </Box>
            </InView>
          ))}
        </Box>
      </Box>
    </Container>
  )
}

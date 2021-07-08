import React, { useEffect } from 'react'
import { Box, Flex, HStack, VStack, Text, useMediaQuery } from '@chakra-ui/react'
import Scrollspy from 'react-scrollspy'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

import { NotificationsNav } from './NotificationsNav'
import { CartNav } from './CartNav'
import { OrdersNav } from './OrdersNav'
import { useClientAuth } from '../../../contexts/AuthClient'
import { ClientNav } from './ClientNav'
import { LogoutNav } from './LogoutNav'
import { useInView } from 'react-intersection-observer'
interface CatalogHeaderProps {
  categoriesData: {
    name: string
    isActive: boolean
  }[]
  showNavCategories: boolean
}

export function CatalogHeader({ categoriesData, showNavCategories = false }: CatalogHeaderProps) {
  const { isAuthenticated } = useClientAuth()

  const [isLargerThan580] = useMediaQuery('(min-width: 580px)')
  const [isLargerThan410] = useMediaQuery('(min-width: 410px)')
  const [isLargerThan200] = useMediaQuery('(min-width: 200px)')

  const getSlidesPerPage = () => {
    if (isLargerThan580) {
      return 4
    }
    if (isLargerThan410) {
      return 3
    }
    if (isLargerThan200) {
      return 2
    }
    return 2
  }

  const activeCategoryIndex = React.useMemo(
    () => categoriesData.findIndex((category) => category.isActive),
    [categoriesData]
  )

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slidesPerView: getSlidesPerPage(),
    spacing: 20,
    centered: false,
  })

  useEffect(() => {
    if (slider) {
      slider.moveToSlide(activeCategoryIndex - 1)
    }
  }, [activeCategoryIndex, slider])

  return (
    <VStack as="header" spacing="0" position="fixed" w="100%" zIndex="1" maxWidth={800}>
      <Flex
        as="header"
        w="100%"
        maxWidth={1480}
        h="20"
        mx="auto"
        py="4"
        px="6"
        align="center"
        bg="#007AFF"
      >
        {isAuthenticated && <LogoutNav />}

        <Flex align="center" ml="auto">
          {isAuthenticated ? (
            <>
              <NotificationsNav />
              <CartNav />
              <OrdersNav />
            </>
          ) : (
            <ClientNav />
          )}
        </Flex>
      </Flex>

      <Flex
        as="header"
        w="100%"
        maxWidth={1480}
        h="16"
        mx="auto"
        py="2"
        align="center"
        bg="white"
        mt="0"
        boxShadow="base"
        visibility={showNavCategories ? 'initial' : 'hidden'}
      >
        <div style={{ width: '100%', height: '100%' }} ref={sliderRef} className="keen-slider">
          <Scrollspy
            items={categoriesData.map((category) => category.name)}
            style={{ width: '100%', height: '100%', display: 'flex' }}
            currentClassName="is-current"
          >
            {categoriesData.map((category, index) => (
              <div
                className="keen-slider__slide"
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '40rem',
                }}
              >
                <Box key={category.name} w="full" h="full" cursor="pointer" minW="44">
                  <Text
                    as="a"
                    href={`#${category.name}`}
                    h="full"
                    w="full"
                    display="flex"
                    justifyContent="center"
                    textAlign="center"
                    alignItems="center"
                    px="4"
                    borderBottomColor="#007AFF"
                    fontWeight="medium"
                    textColor={activeCategoryIndex === index ? '#007AFF' : 'gray.400'}
                    borderBottomWidth={activeCategoryIndex === index && '2px'}
                  >
                    {category.name}
                  </Text>
                </Box>
              </div>
            ))}
          </Scrollspy>
        </div>
      </Flex>
    </VStack>
  )
}

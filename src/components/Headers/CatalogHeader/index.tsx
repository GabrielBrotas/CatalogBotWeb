import React from 'react'
import { Flex } from '@chakra-ui/react'

import { NotificationsNav } from './NotificationsNav'
import { CartNav } from './CartNav'
import { OrdersNav } from './OrdersNav'
import { useClientAuth } from '../../../contexts/AuthClient'
import { ClientNav } from './ClientNav'

export function CatalogHeader() {
  const { isAuthenticated } = useClientAuth()

  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto"
      py="4"
      px="6"
      align="center"
      bg="blue.300"
    >
      {/* <Logo /> */}

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
  )
}
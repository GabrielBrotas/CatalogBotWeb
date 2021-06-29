import React from 'react'
import {
  Box,
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { RiNotificationLine } from 'react-icons/ri'
import { useCompanyAuth } from '../../../contexts/AuthCompany'
import { updateCompanyNotifications } from '../../../services/apiFunctions/companies/notifications'

export function NotificationsNav() {
  const { companyNotifications, setCompanyNotifications } = useCompanyAuth()
  const router = useRouter()

  const navigateToOrder = (orderId: string) => {
    if (orderId) {
      router.push(`/orders/${orderId}`)
    }
  }

  const unreadNotificationsCount = React.useMemo(() => {
    if (companyNotifications && companyNotifications.results.length > 0) {
      const { length } = companyNotifications.results.filter((notification) => !notification.Viewed)
      return length
    }

    return 0
  }, [companyNotifications])

  const markNotificationsAsViewd = (isMenuOpen: boolean) => {
    if (companyNotifications && companyNotifications.results && !isMenuOpen) {
      const notificationsId = companyNotifications.results
        .filter((notification) => !notification.Viewed)
        .map((notification) => notification._id)

      if (notificationsId.length > 0) {
        updateCompanyNotifications({ notificationsId })
        setCompanyNotifications(({ results, total, next, previous }) => ({
          results: results.map((notification) => ({ ...notification, Viewed: true })),
          total,
          next,
          previous,
        }))
      }
    }
  }

  return (
    <HStack
      spacing={['6', '8']}
      mx={['6', '8']}
      pr={['6', '8']}
      py="1"
      color="gray.300"
      borderRightWidth={1}
      borderColor="gray.700"
    >
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              bg="transparent"
              _hover={{ bg: 'transparent' }}
              _active={{ bg: 'transparent' }}
              as={Button}
              spacing={['6', '8']}
              position="relative"
              onClick={() => markNotificationsAsViewd(!isOpen)}
            >
              <Icon as={RiNotificationLine} fontSize="20" />

              {unreadNotificationsCount > 0 && (
                <Box
                  bg="white"
                  w="6"
                  h="6"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="sm"
                  borderRadius="full"
                  position="absolute"
                  top="-1"
                  right="0"
                  textColor="gray.700"
                  fontWeight="bold"
                >
                  <Text p="0" m="0">
                    {unreadNotificationsCount}
                  </Text>
                </Box>
              )}
            </MenuButton>
            <MenuList bg="gray.700" textColor="gray.50">
              {companyNotifications && companyNotifications.results.length > 0 ? (
                companyNotifications.results.map((notification) => (
                  <MenuItem
                    key={notification._id}
                    _hover={{ bg: 'gray.300' }}
                    onClick={() => navigateToOrder(notification.Order)}
                  >
                    <Text>{notification.Text}</Text>
                    {!notification.Viewed && (
                      <Box bg="white" w="3" h="3" borderRadius="full" marginLeft="3" />
                    )}
                  </MenuItem>
                ))
              ) : (
                <MenuItem
                  _hover={{ bg: 'gray.700' }}
                  _focus={{ bg: 'gray.700' }}
                  _active={{ bg: 'gray.700' }}
                >
                  Você não possui notificações
                </MenuItem>
              )}
            </MenuList>
          </>
        )}
      </Menu>
    </HStack>
  )
}

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
import { RiNotificationLine } from 'react-icons/ri'
import { useClientAuth } from '../../../contexts/AuthClient'
import { updateClientNotifications } from '../../../services/apiFunctions/clients/notifications'
import { useOrderModal } from '../../../contexts/Modals/OrderModal'

export function NotificationsNav() {
  const { clientsNotifications, setClientsNotifications } = useClientAuth()
  const { openOrderModal, setSelectedOrder, orders } = useOrderModal()

  const navigateToOrder = (orderId: string) => {
    if (orderId) {
      const order = orders.results.find((order) => String(order._id) === String(orderId))

      if (order) {
        setSelectedOrder(order)
        openOrderModal()
      }
    }
  }

  const unreadNotificationsCount = React.useMemo(() => {
    if (clientsNotifications && clientsNotifications.results.length > 0) {
      const { length } = clientsNotifications.results.filter((notification) => !notification.Viewed)
      return length
    }

    return 0
  }, [clientsNotifications])

  const markNotificationsAsViewd = () => {
    if (clientsNotifications && clientsNotifications.results) {
      const notificationsId = clientsNotifications.results
        .filter((notification) => !notification.Viewed)
        .map((notification) => notification._id)

      if (notificationsId.length > 0) {
        updateClientNotifications({ notificationsId })
        setClientsNotifications(({ results, total, next, previous }) => ({
          results: results.map((notification) => ({ ...notification, Viewed: true })),
          total,
          next,
          previous,
        }))
      }
    }
  }

  return (
    <HStack color="whiteAlpha.800" cursor="pointer">
      <Menu onClose={markNotificationsAsViewd}>
        <MenuButton
          bg="transparent"
          _hover={{ bg: 'transparent' }}
          _active={{ bg: 'transparent' }}
          as={Button}
          position="relative"
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
              textColor="#007aff"
              fontWeight="bold"
            >
              <Text p="0" m="0">
                {unreadNotificationsCount}
              </Text>
            </Box>
          )}
        </MenuButton>
        <MenuList bg="white" textColor="gray.700">
          {clientsNotifications && clientsNotifications.results.length > 0 ? (
            clientsNotifications.results.map((notification) => (
              <MenuItem
                key={notification._id}
                _hover={{ bg: 'gray.75' }}
                onClick={() => navigateToOrder(notification.Order)}
                display="flex"
                flexDir="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text>{notification.Text}</Text>
                {!notification.Viewed && (
                  <Box bg="#007aff" w="3" h="3" borderRadius="full" marginLeft="3" />
                )}
              </MenuItem>
            ))
          ) : (
            <MenuItem
              _hover={{ bg: 'gray.75' }}
              _focus={{ bg: 'gray.75' }}
              _active={{ bg: 'gray.75' }}
            >
              Você não possui notificações
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </HStack>
  )
}

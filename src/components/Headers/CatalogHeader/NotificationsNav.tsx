import { HStack, Icon } from '@chakra-ui/react'
import React from 'react'
import { RiNotificationLine } from 'react-icons/ri'

export function NotificationsNav() {
  return (
    <HStack mx="6" py="1" color="whiteAlpha.800" cursor="pointer">
      <Icon as={RiNotificationLine} fontSize="20" />
    </HStack>
  )
}

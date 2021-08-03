import React from 'react'
import { Flex, Icon, IconButton, useBreakpointValue } from '@chakra-ui/react'

import { Logo } from './Logo'
import { NotificationsNav } from './NotificationsNav'
import { Profile } from './Profile'
import { useSidebarDrawer } from '../../../contexts/Modals/SidebarDrawerContext'
import { RiMenuLine } from 'react-icons/ri'

export function CompanyHeader() {
  const { onOpen } = useSidebarDrawer()

  // no mobile vai ser false, no large vai ser true, para mostrar o nome e email do usuario
  const isMobileView = useBreakpointValue({
    base: true,
    lg: false,
  })

  return (
    <Flex as="header" w="100%" maxWidth={1480} h="20" mx="auto" mt="4" px="6" align="center">
      {isMobileView && (
        <IconButton
          icon={<Icon as={RiMenuLine} />}
          fontSize="24"
          variant="unstyled"
          onClick={onOpen}
          aria-label="Open navigation"
        />
      )}
      <Logo />

      <Flex align="center" ml="auto">
        <NotificationsNav />

        <Profile mobileView={isMobileView} />
      </Flex>
    </Flex>
  )
}

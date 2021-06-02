import React from 'react';
import { Flex, Icon, IconButton, useBreakpointValue } from '@chakra-ui/react';

import { Logo } from './Logo';
import { NotificationsNav } from './NotificationsNav';
import { Profile } from './Profile';
import { SearchBar } from './SearchBar';
import { useSidebarDrawer } from '../../contexts/SidebarDrawerContext';
import { RiMenuLine } from 'react-icons/ri';

export function Header() {
  const { onOpen } = useSidebarDrawer();

  // no mobile vai ser false, no large vai ser true, para mostrar o nome e email do usuario
  const mobileView = useBreakpointValue({
    base: true,
    lg: false,
  });

  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto"
      mt="4"
      px="6"
      align="center"
    >
      {mobileView && (
        <IconButton
          icon={<Icon as={RiMenuLine} />}
          fontSize="24"
          variant="unstyled"
          onClick={onOpen}
          aria-label="Open navigation"
        />
      )}
      <Logo />

      {!mobileView && <SearchBar />}

      <Flex align="center" ml="auto">

        <NotificationsNav />

        <Profile mobileView={mobileView} />
      </Flex>
    </Flex>
  );
}

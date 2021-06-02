import {
  Avatar,
  Box,
  Text,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { signOutCompany } from '../../contexts/authCompany';

interface ProfileProps {
  mobileView: boolean;
}

export function Profile({ mobileView }: ProfileProps) {
  const handleLogout = useCallback(() => {
    signOutCompany();
  }, []);

  return (
    <Flex align="center">
      <Menu>
        {!mobileView && (
          <Box mr="2">
            <Text>Gabriel Brotas</Text>
            <Text color="gray.300" fontSize="small">
              gabrielbrotas22@gmail.com
            </Text>
          </Box>
        )}

        <MenuButton>
          <Avatar
            size="md"
            name="Gabriel Brotas"
            src="https://github.com/GabrielBrotas.png"
          />
        </MenuButton>

        <MenuList bg="gray.600">
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

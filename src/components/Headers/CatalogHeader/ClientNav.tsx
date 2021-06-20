import React, { useCallback } from 'react'
import { Avatar, Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { useClientAuth } from '../../../contexts/AuthClient'

export function ClientNav() {
  const { client, signOutClient, isAuthenticated, openModal } = useClientAuth()

  const handleLogout = useCallback(() => {
    signOutClient()
  }, [])

  const openLoginModal = () => {
    openModal({ type: 'login' })
  }

  const openRegisterModal = () => {
    openModal({ type: 'register' })
  }

  return (
    <Flex align="center">
      <Menu>
        <MenuButton>
          <Avatar size="md" name={client?.name} />
        </MenuButton>

        <MenuList>
          {isAuthenticated ? (
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          ) : (
            <>
              <MenuItem onClick={openLoginModal}>Entrar</MenuItem>
              <MenuItem onClick={openRegisterModal}>Cadastre-se</MenuItem>
            </>
          )}
        </MenuList>
      </Menu>
    </Flex>
  )
}

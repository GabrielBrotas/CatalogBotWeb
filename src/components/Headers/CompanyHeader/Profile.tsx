import { Avatar, Box, Text, Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { signOutCompany, useCompanyAuth } from '../../../contexts/AuthCompany'

interface ProfileProps {
  mobileView: boolean
}

export function Profile({ mobileView }: ProfileProps) {
  const { company } = useCompanyAuth()

  const [isOpen, setIsOpen] = React.useState(false)

  const handleLogout = useCallback(() => {
    signOutCompany()
  }, [])

  return (
    <Flex align="center">
      <Menu>
        {!mobileView && (
          <Box mr="2">
            <Text>{company?.name}</Text>
            <Text color="gray.300" fontSize="small">
              {company?.email}
            </Text>
          </Box>
        )}

        <MenuButton onClick={() => setIsOpen(!isOpen)}>
          <Avatar size="md" name={company?.name} src={company?.mainImageUrl} />
        </MenuButton>

        <MenuList bg="gray.600" display={!isOpen ? 'none' : 'block'}>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

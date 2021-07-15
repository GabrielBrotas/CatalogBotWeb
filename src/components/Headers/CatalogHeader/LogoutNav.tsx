import React from 'react'
import { HStack, Icon } from '@chakra-ui/react'
import { useClientAuth } from '../../../contexts/AuthClient'
import { BiLogOutCircle } from 'react-icons/bi'

export function LogoutNav() {
  const { signOut } = useClientAuth()

  const handleLogout = () => {
    console.log('sign out client')
    signOut()
  }

  return (
    <HStack mx="2" py="1" color="whiteAlpha.900" cursor="pointer" onClick={handleLogout}>
      <Icon as={BiLogOutCircle} fontSize="24" />
    </HStack>
  )
}

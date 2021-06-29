import React from 'react'
import { Flex } from '@chakra-ui/react'

export const Section: React.FC = ({ children }) => {
  return (
    <Flex as="section" w="100%" h="100vh" maxWidth={1480} mx="auto" flexDir="column" p="0">
      {children}
    </Flex>
  )
}

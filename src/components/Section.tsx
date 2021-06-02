import React from 'react'
import { Flex } from '@chakra-ui/react'

export const Section: React.FC = ({ children }) => {
  return (
    <Flex as="section" w="100%" maxWidth={1480} mx="auto">
      {children}
    </Flex>
  )
}

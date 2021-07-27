import React from 'react'
import { Flex, Box, Text } from '@chakra-ui/react'

interface CardMessageProps {
  index: string
  text: string
}

export const CardMessage = ({ index, text }: CardMessageProps) => {
  return (
    <Flex w="full">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        // py="3"
        // px="4"
        minW="16"
        maxW="16"
        // h="16"
        bg="gray.700"
        marginRight={4}
        borderRadius="lg"
        mb={1}
      >
        <Text color="gray.300" fontSize="md">
          {index}
        </Text>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p="3"
        bg="gray.700"
        marginRight={4}
        borderRadius="lg"
        mb={1}
        w="full"
      >
        <Text color="gray.300" fontSize="md">
          {text}
        </Text>
      </Box>
    </Flex>
  )
}

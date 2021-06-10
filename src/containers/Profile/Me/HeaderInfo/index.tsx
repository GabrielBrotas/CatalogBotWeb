import React from 'react'
import { Avatar, Box, SimpleGrid, Text, useBreakpointValue } from '@chakra-ui/react'

interface HeaderInfoProps {
  name: string
  email: string
  description?: string
  mainImageUrl?: string
}

export const HeaderInfo = ({ email, name, description, mainImageUrl }: HeaderInfoProps) => {
  const isMobileView = useBreakpointValue({
    base: true,
    lg: false,
  })

  return (
    <SimpleGrid
      templateColumns={`${isMobileView ? '1fr' : '5rem 1fr'}`}
      minChildWidth="100px"
      gridGap="12"
      w="100%"
    >
      <Avatar size="2xl" name={name} src={mainImageUrl} />

      <Box marginLeft="6" display="flex" flexDir="column">
        <Text color="gray.300" isTruncated fontSize="2xl">
          {name}
        </Text>
        <Text color="gray.300" isTruncated fontSize="xl" mt={1}>
          {email}
        </Text>

        <Text color="gray.300" fontSize="xl" mt={4}>
          {description ? description : 'Sem descrição'}
        </Text>
      </Box>
    </SimpleGrid>
  )
}

import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { CompanyHeader } from '../components/Headers/CompanyHeader'
import { Sidebar } from '../components/Sidebar'
import { withCompanySSRAuth } from '../utils/withSSRAuth'

export default function Login() {
  return (
    <Box>
      <CompanyHeader />

      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px="6">
        <Sidebar />

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p="8"
        >
          <Text>Em breve...</Text>
        </Box>
      </Flex>
    </Box>
  )
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  return {
    props: {},
  }
})

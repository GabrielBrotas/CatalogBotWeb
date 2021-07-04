import React, { useEffect } from 'react'
import { Box, Flex, Text, VStack, Heading, Spinner, Button } from '@chakra-ui/react'
import { CompanyHeader } from '../../components/Headers/CompanyHeader'
import { Sidebar } from '../../components/Sidebar'
import { WhatsAppModal } from './modal'
import { useCompanyAuth } from '../../contexts/AuthCompany'

export const WhatsAppContainer = () => {
  const {
    connectWhatsapp,
    wppConnectionData,
    isWppConnected,
    qrCode,
    wppConnIsLoading,
    disconnectWhatsApp,
    isSocketConnected,
  } = useCompanyAuth()

  useEffect(() => {
    if (!isWppConnected && !wppConnIsLoading && isSocketConnected) {
      console.log('call func')
      connectWhatsapp()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSocketConnected])

  return (
    <Box>
      <CompanyHeader />

      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px="6">
        <Sidebar />

        <Box display="flex" flex="1" borderRadius={8} bg="gray.800" p="8">
          {wppConnIsLoading ? (
            <Flex flex="1" align="center" justifyContent="center">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <>
              <VStack align="flex-start" h="full">
                <Flex mb="4">
                  <Text>Status:</Text>
                  <Text ml="4">{isWppConnected ? 'Ativo' : 'Inativo'}</Text>
                </Flex>

                {isWppConnected && (
                  <>
                    <Heading as="h4" size="md">
                      Dados da conexão:
                    </Heading>
                    <Flex>
                      <Text>Nome:</Text>
                      <Text ml="4">{wppConnectionData.name}</Text>
                    </Flex>

                    <Flex>
                      <Text>Telefone:</Text>
                      <Text ml="4">{wppConnectionData.cellphone}</Text>
                    </Flex>

                    <Flex>
                      <Text>Modelo do celular:</Text>
                      <Text ml="4">{wppConnectionData.cellphone_model}</Text>
                    </Flex>

                    <Button onClick={disconnectWhatsApp} colorScheme="pink">
                      Desconectar
                    </Button>
                  </>
                )}
              </VStack>
            </>
          )}

          <Box ml="auto">
            <WhatsAppModal />
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}

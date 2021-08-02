import React, { useEffect } from 'react'
import Link from 'next/link'
import { Box, Flex, Text, VStack, Heading, Spinner, Button } from '@chakra-ui/react'

import { CompanyHeader } from '../../../components/Headers/CompanyHeader'
import { Sidebar } from '../../../components/Sidebar'
import { WhatsAppModal } from './modal'
import { useCompanyAuth } from '../../../contexts/AuthCompany'
import { CardMessage } from './card-message'

export const WhatsAppContainer = () => {
  const {
    connectWhatsapp,
    wppConnectionData,
    isWppConnected,
    wppConnIsLoading,
    disconnectWhatsApp,
    isSocketConnected,
    company,
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

        <Box display="flex" flexDir="column" flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8">
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
          </Flex>

          <Flex flexDir="column" align="flex-start" mb={8} w="full">
            <Flex alignItems="center" justifyContent="space-between" w="full" mb="4">
              <Text fontSize="xl" fontWeight="medium" mb="4">
                Fluxo de Conversa
              </Text>

              <Link href="/whatsapp/edit" passHref>
                <Button colorScheme="telegram">Editar Fluxo</Button>
              </Link>
            </Flex>

            <VStack align="flex-start" w="full">
              {company &&
                company.flow &&
                Object.keys(company.flow).map((f) => (
                  <CardMessage key={f} index={f} text={company.flow[f]} />
                ))}
            </VStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

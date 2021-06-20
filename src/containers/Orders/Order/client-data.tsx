import React from 'react'
import {
  Flex,
  Text,
  Heading,
  VStack,
  UnorderedList,
  ListItem,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Address, Client } from '../../../services/apiFunctions/clients/client/types'

interface ClientDataProps {
  client: Client
  deliveryAddress: Address
}

export const ClientData = ({ client, deliveryAddress }: ClientDataProps) => {
  const isMobileView = useBreakpointValue({
    base: true,
    md: false,
    lg: false,
  })

  return (
    <VStack w="full" alignItems="flex-start" mb="6">
      <Heading as="h3" fontWeight="normal" size="lg">
        Dados do cliente
      </Heading>
      <Flex
        alignItems={isMobileView ? 'flex-start' : 'center'}
        justifyContent={isMobileView ? 'flex-start' : 'space-between'}
        w="full"
        flexDir={isMobileView ? 'column' : 'row'}
      >
        <Flex mb={isMobileView ? '2' : '0'}>
          <Text mr="4">Nome:</Text>
          <Text>{client.name}</Text>
        </Flex>

        <Flex>
          <Text mr="4">Telefone para contato:</Text>
          <Text>{client.cellphone}</Text>
        </Flex>
      </Flex>
      <Flex>
        <Text mr="4">Email: </Text>
        <Text>{client.email}</Text>
      </Flex>

      <Flex flexDir="column">
        <Text mr="4" mb="2">
          Endereço de entrega:{' '}
        </Text>
        <UnorderedList marginLeft="8" spacing={2}>
          <ListItem>Estado: {deliveryAddress.state}</ListItem>
          <ListItem>Cidade: {deliveryAddress.city}</ListItem>
          <ListItem>Cep: {deliveryAddress.cep}</ListItem>
          <ListItem>Bairro: {deliveryAddress.neighborhood}</ListItem>
          <ListItem>Número: {deliveryAddress.number}</ListItem>
          <ListItem>Rua: {deliveryAddress.street}</ListItem>
        </UnorderedList>
      </Flex>
    </VStack>
  )
}

import React from 'react'
import { Box, Flex, Text, VStack, Button, UnorderedList, ListItem } from '@chakra-ui/react'
import { CompanyHeader } from '../../../components/Headers/CompanyHeader'
import { Sidebar } from '../../../components/Sidebar'
import { CardMessage } from './card-message'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'
import { updateCompanyFlow } from '../../../services/apiFunctions/companies/company'
import { useRouter } from 'next/router'
import { useToast } from '../../../contexts/Modals/Toast'
import { useCompanyAuth } from '../../../contexts/AuthCompany'

type ConversationFormType = {
  '1': string
  '2': string
  '2-1-1': string
  '2-1-2': string
  '2-2-1': string
  '2-2-2': string
  '2-3-1': string
  '2-3-2': string
  '2-4': string
  '3-1': string
  '3-2': string
  '3-3': string
  '3-4': string
}

const ConversationFormSchema = object().shape({
  '1': string().required('Campo obrigatório'),
  '2': string().required('Campo obrigatório'),
  '2-1-1': string().required('Campo obrigatório'),
  '2-1-2': string().required('Campo obrigatório'),
  '2-2-1': string().required('Campo obrigatório'),
  '2-2-2': string().required('Campo obrigatório'),
  '2-3-1': string().required('Campo obrigatório'),
  '2-3-2': string().required('Campo obrigatório'),
  '2-4': string().required('Campo obrigatório'),
  '3-1': string().required('Campo obrigatório'),
  '3-2': string().required('Campo obrigatório'),
  '3-3': string().required('Campo obrigatório'),
  '3-4': string().required('Campo obrigatório'),
})

export const EditWhatsAppContainer = () => {
  const router = useRouter()

  const { company, setCompany } = useCompanyAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(ConversationFormSchema),
    defaultValues: company && company.flow,
  })

  const { addToast } = useToast()

  const handleEditFlux: SubmitHandler<ConversationFormType> = async (data, event) => {
    event.preventDefault()
    try {
      await updateCompanyFlow({ flow: data })

      addToast({
        title: 'Fluxo atualizado com sucesso!',
        status: 'success',
      })

      setCompany({ ...company, flow: data })
      router.push('/whatsapp')
    } catch (err) {
      console.log(err)
    }
  }

  React.useEffect(() => {
    if (company) {
      setValue('1', company.flow[1])
      setValue('2', company.flow[2])
      setValue('2-1-1', company.flow['2-1-1'])
      setValue('2-1-2', company.flow['2-1-2'])
      setValue('2-2-1', company.flow['2-2-1'])
      setValue('2-2-2', company.flow['2-2-2'])
      setValue('2-3-1', company.flow['2-3-1'])
      setValue('2-3-2', company.flow['2-3-2'])
      setValue('2-4', company.flow['2-4'])
      setValue('3-1', company.flow['3-1'])
      setValue('3-2', company.flow['3-2'])
      setValue('3-3', company.flow['3-3'])
      setValue('3-4', company.flow['3-4'])
    }
  }, [company, setValue])

  return (
    <Box w={['max-content', '100%']}>
      <CompanyHeader />

      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px="6">
        <Sidebar />

        <Box display="flex" flexDir="column" flex="1" borderRadius={8} bg="gray.800" p="8">
          <Text fontSize="xl" fontWeight="medium" mb="4">
            Fluxo de Conversa
          </Text>

          <Box mb="4">
            <Text fontSize="lg" fontWeight="medium" mb="4">
              Legendas
            </Text>

            <UnorderedList>
              <ListItem>{`{{name}} = Nome da Empresa`}</ListItem>
              <ListItem>{`{{link}} = Link para o catálogo`}</ListItem>
              <ListItem>{`{{DeliveryTime}} = Tempo para chegar na casa do cliente (Só pode ser utilzada na 3-2)`}</ListItem>
              <ListItem>{`{{OrderUrl}} = Link para abrir o pedido (Só pode ser utilzada no grupo 3)`}</ListItem>
            </UnorderedList>
          </Box>

          <VStack align="flex-start" as="form" onSubmit={handleSubmit(handleEditFlux)}>
            <CardMessage
              index="1"
              title="Mensagem de boas vindas."
              readOnly={false}
              register={register}
              errors={errors}
            />

            <CardMessage
              index="2"
              readOnly={false}
              title="Opções do menu. (Seguir ordem 1,2,3,4)!"
              register={register}
              errors={errors}
            />

            <CardMessage
              index="2-1-1"
              readOnly={false}
              title="Mensagem automatica para a opção 1 (Catálogo/Pedido)."
              register={register}
              errors={errors}
            />

            <CardMessage
              index="2-1-2"
              readOnly={false}
              title="Resposta após enviar o link do cátalogo. (Após isso é encerrado a conversa.)"
              register={register}
              errors={errors}
            />

            <CardMessage
              index="2-2-1"
              readOnly={false}
              title="Resposta para a opção 2. (Entrega)"
              register={register}
              errors={errors}
            />

            <CardMessage
              index="2-2-2"
              readOnly={false}
              title="Resposta após enviar informações sobre entrega. (Após isso é encerrado a conversa.)"
              register={register}
              errors={errors}
            />

            <CardMessage
              index="2-3-1"
              readOnly={false}
              title="Resposta para a opção 3. (Pagamento)"
              register={register}
              errors={errors}
            />

            <CardMessage
              index="2-3-2"
              readOnly={false}
              title="Resposta após enviar informações sobre pagamento. (Após isso é encerrado a conversa.)"
              register={register}
              errors={errors}
            />

            <CardMessage
              index="3-1"
              readOnly={false}
              title="Mensagem enviada após confirmar pedido"
              register={register}
              errors={errors}
            />

            <CardMessage
              index="3-2"
              readOnly={false}
              title="Mensagem enviada após enviar pedido"
              register={register}
              errors={errors}
            />

            <CardMessage
              index="3-3"
              readOnly={false}
              title="Mensagem enviada após entregar pedido"
              register={register}
              errors={errors}
            />

            <CardMessage
              index="3-4"
              readOnly={false}
              title="Mensagem enviada após cancelar pedido"
              register={register}
              errors={errors}
            />

            <Flex align="center" justify="flex-end" mt="4" w="full">
              <Link href="/whatsapp" passHref>
                <Button colorScheme="telegram">Cancelar</Button>
              </Link>

              <Button ml="8" colorScheme="pink" type="submit" isLoading={isSubmitting}>
                Atualizar
              </Button>
            </Flex>
          </VStack>
        </Box>
      </Flex>
    </Box>
  )
}

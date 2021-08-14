import React from 'react'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { string, object } from 'yup'

import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from '@chakra-ui/react'
import { CompanyHeader } from '../../../components/Headers/CompanyHeader'
import { Sidebar } from '../../../components/Sidebar'
import { FormInput } from '../../../components/Form/input'
import { EditCategoryProps } from '../../../pages/categories/edit/[cId]'
import { useToast } from '../../../contexts/Modals/Toast'
import { updateCategory } from '../../../services/apiFunctions/companies/categories'
import { useRouter } from 'next/router'

type EditCategoryFormData = {
  name: string
}

const editCategoryFormSchema = object().shape({
  name: string().required('Nome obrigatório'),
})

export const EditCategoryContainer = ({ category }: EditCategoryProps) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(editCategoryFormSchema),
  })

  const { addToast } = useToast()

  const handleCreateCategory: SubmitHandler<EditCategoryFormData> = async (values) => {
    try {
      const { name } = values
      await updateCategory({ categoryId: category._id, name: name.trim() })
      addToast({
        status: 'success',
        title: 'Categoria atualizada com sucesso!',
      })
      router.push('/categories')
    } catch (err) {
      addToast({
        status: 'error',
        title: 'Desculpe, algo deu errado!',
        description: 'Tente novamente mais tarde',
      })
    }
  }

  return (
    <Box w={['max-content', '100%']}>
      <CompanyHeader />

      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={['6', '8']}
          onSubmit={handleSubmit(handleCreateCategory)}
        >
          <Heading size="lg" fontWeight="normal">
            Editar categoria
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <FormInput
                name="name"
                label="Nome da categoria"
                {...register('name')}
                error={errors.name}
                defaultValue={category.name}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/categories" passHref>
                <Button colorScheme="whiteAlpha">Cancelar</Button>
              </Link>

              <Button type="submit" colorScheme="pink" isLoading={isSubmitting}>
                Atualizar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

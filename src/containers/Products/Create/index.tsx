import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Box, Button, Divider, Flex, Heading, HStack, Tooltip, VStack } from '@chakra-ui/react'
import { CompanyHeader } from '../../../components/Headers/CompanyHeader'
import { Sidebar } from '../../../components/Sidebar'
import Upload, { UploadedImages } from '../../../components/Upload'
import { CreateProductProps } from '../../../pages/products/create'
import { useToast } from '../../../contexts/Modals/Toast'
import {
  createProduct,
  updateProductImage,
} from '../../../services/apiFunctions/companies/products'
import { queryClient } from '../../../services/queryClient'
import { CreateProductFormData, createProductFormSchema } from './types'
import { ProductMainData } from '../forms/main-data.form.'
import { ProductOptionForm } from '../forms/product-options.form'
import { ProductOption } from '../../../services/apiFunctions/companies/products/types'
import { removeIdFromProductOptions } from '../../../utils/dataFormat'

export const CreateProductContainer = ({ categories }: CreateProductProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormData>({
    resolver: yupResolver(createProductFormSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  })

  const router = useRouter()
  const { addToast } = useToast()

  const [uploadedImages, setUploadedImages] = useState<Array<UploadedImages>>([])

  const addMoreProductOptions = () => {
    append({
      _id: Date.now().toString(),
      name: '',
      isRequired: true,
      maxQuantity: 1,
      minQuantity: 1,
      additionals: [{ _id: Date.now().toString(), name: '', price: 0 }],
    })
  }

  const removeProductOption = (productOptionindex: number) => {
    remove(productOptionindex)
  }

  const handleCreateProduct: SubmitHandler<CreateProductFormData> = async (values, event) => {
    event.preventDefault()
    try {
      const { name, price, description, categoryId, options } = values

      const product = await createProduct({
        name,
        price: Number(price),
        description,
        categoryId,
        options: removeIdFromProductOptions(options),
      })

      if (uploadedImages[0] && uploadedImages[0].file) {
        console.log('upload')
        await updateProductImage({ productId: product._id, image: uploadedImages[0].file })
      }

      addToast({
        status: 'success',
        title: 'Produto criado com sucesso!',
      })
      queryClient.invalidateQueries('products')
      router.push('/products')
    } catch (err) {
      addToast({
        status: 'error',
        title: 'Desculpe, algo deu errado!',
        description: 'Tente novamente mais tarde',
      })
    }
  }

  return (
    <Box>
      <CompanyHeader />

      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={['6', '8']}
          onSubmit={handleSubmit(handleCreateProduct)}
        >
          <Heading size="lg" fontWeight="normal">
            Criar produto
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <Upload uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} />

            <ProductMainData categories={categories} errors={errors} register={register} />

            <Divider my="6" borderColor="gray.700" />

            {fields.map((field, index) => (
              <ProductOptionForm
                key={field._id}
                errors={errors}
                register={register}
                control={control}
                productOptionAdditionals={field.additionals}
                productOptionIndex={index}
                removeProductOption={removeProductOption}
                defaultOptionName={field.name}
                defaultOptionIsRequired={field.isRequired}
                defaultOptionMaxQuantity={field.maxQuantity}
                defaultOptionMinQuantity={field.minQuantity}
              />
            ))}

            <Tooltip
              label="Opções adicionais são subcategorias do seu produto!"
              aria-label="A tooltip"
              textAlign="center"
            >
              <Button
                display="flex"
                type="button"
                colorScheme="pink"
                onClick={addMoreProductOptions}
              >
                Adicionar opções adicionais
              </Button>
            </Tooltip>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/products" passHref>
                <Button colorScheme="whiteAlpha">Cancelar</Button>
              </Link>

              <Button type="submit" colorScheme="pink" isLoading={isSubmitting}>
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

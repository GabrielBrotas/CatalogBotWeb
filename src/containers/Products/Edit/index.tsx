import React, { useState } from 'react'
import Link from 'next/link'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Box, Button, Divider, Flex, Heading, HStack, VStack } from '@chakra-ui/react'
import { Header } from '../../../components/Header'
import { Sidebar } from '../../../components/Sidebar'
import { EditProductProps } from '../../../pages/products/edit/[pId]'
import { useToast } from '../../../contexts/Toast'
import { useRouter } from 'next/router'
import Upload, { UploadedImages } from '../../../components/Upload'
import { EditProductFormData, editProductFormSchema } from './types'
import { ProductMainData } from '../forms/main-data.form.'
import { ProductOptionForm } from '../forms/product-options.form'
import { updateProduct } from '../../../services/apiFunctions/companies/products'
import { removeIdFromProductOptions } from '../../../utils/dataFormat'

export const EditProductContainer = ({ product, categories }: EditProductProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProductFormData>({
    resolver: yupResolver(editProductFormSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.priceFormated,
      options: product.options,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  })

  const { addToast } = useToast()
  const router = useRouter()
  const [uploadedImages, setUploadedImages] = useState<Array<UploadedImages>>(
    product.imageUrl
      ? [
          {
            id: `${new Date().toString()}-${product.name}`,
            name: null,
            size: null,
            preview: null,
            progress: 100,
            uploaded: true,
            error: false,
            url: product.imageUrl,
          },
        ]
      : []
  )

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

  const handleEditProduct: SubmitHandler<EditProductFormData> = async (values, event) => {
    event.preventDefault()
    try {
      const { name, price, description, categoryId, options } = values
      await updateProduct({
        name,
        categoryId,
        price: Number(price),
        description,
        options: removeIdFromProductOptions(options),
        productId: product._id,
      })

      addToast({
        status: 'success',
        title: 'Produto atualizado com sucesso!',
      })
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
      <Header />

      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={['6', '8']}
          onSubmit={handleSubmit(handleEditProduct)}
        >
          <Heading size="lg" fontWeight="normal">
            Editar produto
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <Upload uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} />

            <ProductMainData
              categories={categories}
              errors={errors}
              register={register}
              defaultCategory={product.category && product.category.name}
              defaultDescription={product.description}
              defaultName={product.name}
              defaultPrice={product.price}
            />

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
            <Button type="button" colorScheme="pink" onClick={addMoreProductOptions}>
              Adicionar opções adicionais
            </Button>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/products" passHref>
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

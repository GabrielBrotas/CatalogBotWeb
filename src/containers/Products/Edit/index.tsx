import React, { useCallback, useReducer, useState } from 'react'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from '@chakra-ui/react'
import { Header } from '../../../components/Header'
import { Sidebar } from '../../../components/Sidebar'
import { FormInput } from '../../../components/Form/input'
import { FormTextArea } from '../../../components/Form/textarea'
import { FormSelect } from '../../../components/Form/select'
import { ProductOption } from '../Create'
import { EditProductProps } from '../../../pages/products/edit/[pId]'
import { updateProduct } from '../../../services/apiFunctions/products'
import { useToast } from '../../../contexts/Toast'
import { useRouter } from 'next/router'
import Upload, { UploadedImages } from '../../../components/Upload'

export type OptionAdditional = {
  name: string
  price: number
}

type EditProductFormData = {
  name: string
  price: number
  description?: string
  options?: ProductOption[]
  categoryId: string
}

type RemoveProductAdditionalOptionProps = {
  productOptionindex: number
  additionProductOptionindex: number
}

type AddProductAdditionalOptionsProps = {
  productOptionindex: number
}

const createProductFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  price: yup.string().required('Valor obrigatório'),
  description: yup.string(),
  categoryId: yup.string().required('Categoria obrigatória'),
  options: yup.array(
    yup.object({
      name: yup.string().required('Nome da opção obrigatório'),
      isRequired: yup.boolean(),
      maxQuantity: yup.string().required('Quantidade maxima obrigatório'),
      minQuantity: yup.string().required('Quantidade mínima obrigatório'),
      additionals: yup.array(
        yup.object({
          name: yup.string().required('Nome obrigatório'),
          price: yup.string().required('Valor obrigatório'),
        })
      ),
    })
  ),
})

export const EditProductContainer = ({ product, categories }: EditProductProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    unregister,
  } = useForm({
    resolver: yupResolver(createProductFormSchema),
  })
  const { addToast } = useToast()
  const router = useRouter()
  const [productOptions, setProductsOptions] = useState<ProductOption[]>(product.options)
  const [uploadedImages, setUploadedImages] = useState<Array<UploadedImages>>([
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
  ])

  const addMoreProductOptions = () => {
    setProductsOptions(
      productOptions.concat({
        name: '',
        isRequired: true,
        maxQuantity: 1,
        minQuantity: 1,
        additionals: [{ name: '', price: 0 }],
      })
    )
  }

  const addProductAdditionalOptions = ({
    productOptionindex,
  }: AddProductAdditionalOptionsProps) => {
    setProductsOptions(
      productOptions.map((product, i) =>
        i !== productOptionindex
          ? product
          : {
              ...product,
              additionals: product.additionals.concat({ name: '', price: 0 }),
            }
      )
    )
  }

  const removeProductAdditionalOptions = ({
    productOptionindex,
    additionProductOptionindex,
  }: RemoveProductAdditionalOptionProps) => {
    setProductsOptions(
      productOptions.map((product, pOindex) =>
        pOindex !== productOptionindex
          ? product
          : {
              ...product,
              additionals: product.additionals.filter(
                (_, aPOindex) => aPOindex !== additionProductOptionindex
              ),
            }
      )
    )
    clearErrors()
    unregister([
      `options.${productOptionindex}.additionals.${additionProductOptionindex}.name`,
      `options.${productOptionindex}.additionals.${additionProductOptionindex}.price`,
    ])
  }

  const removeProductOption = (productOptionindex: number) => {
    setProductsOptions(productOptions.filter((product, pOindex) => pOindex !== productOptionindex))
    clearErrors()
    unregister([`options.${productOptionindex}`, `options.${productOptionindex}`])
  }

  const handleCreateProduct: SubmitHandler<EditProductFormData> = async (values, event) => {
    event.preventDefault()
    try {
      const { name, price, description, categoryId, options } = values
      await updateProduct({ name, categoryId, price, description, options, productId: product._id })
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
          onSubmit={handleSubmit(handleCreateProduct)}
        >
          <Heading size="lg" fontWeight="normal">
            Editar produto
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <Upload uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} />
            <FormInput
              name="name"
              label="Nome do produto"
              {...register('name')}
              error={errors.name}
              defaultValue={product.name}
            />
            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <FormInput
                name="price"
                label="Valor"
                type="number"
                {...register('price')}
                error={errors.price}
                defaultValue={product.price}
              />
              <FormSelect
                name="categoryId"
                label="Categoria"
                {...register('categoryId')}
                defaultValue={product.category && product.category.name}
                options={categories.map((category) => ({
                  label: category.name,
                  value: category._id,
                }))}
                error={errors.categoryId}
              />
            </SimpleGrid>

            <FormTextArea
              name="description"
              label="Descrição"
              {...register('description')}
              error={errors.description}
              defaultValue={product.description}
            />

            <Divider my="6" borderColor="gray.700" />

            {productOptions.map((productOption, pOindex) => (
              <Box w="100%" key={pOindex} textAlign="right">
                <Button
                  type="button"
                  colorScheme="red"
                  justifySelf="flex-end"
                  mt={2}
                  onClick={() => removeProductOption(pOindex)}
                >
                  Remover opção
                </Button>
                <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                  <FormInput
                    name={`options.${pOindex}.name`}
                    label="Nome da opção"
                    {...register(`options.${pOindex}.name`)}
                    error={
                      errors.options && errors.options[pOindex] && errors.options[pOindex].name
                    }
                    defaultValue={productOption.name}
                  />
                  <FormSelect
                    name="isRequired"
                    label="É obrigatório?"
                    {...register(`options.${pOindex}.isRequired`)}
                    options={[
                      { value: 'true', label: 'Sim' },
                      { value: 'false', label: 'Não' },
                    ]}
                    error={
                      errors.options &&
                      errors.options[pOindex] &&
                      errors.options[pOindex].isRequired
                    }
                    defaultValue={String(productOption.isRequired)}
                  />
                </SimpleGrid>
                <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%" mt={4}>
                  <FormInput
                    name={`options.${pOindex}.minQuantity`}
                    label="Quantidade mínima"
                    type="number"
                    {...register(`options.${pOindex}.minQuantity`)}
                    error={
                      errors.options &&
                      errors.options[pOindex] &&
                      errors.options[pOindex].minQuantity
                    }
                    defaultValue={productOption.minQuantity}
                  />
                  <FormInput
                    label="Quantidade máxima"
                    name={`options.${pOindex}.maxQuantity`}
                    type="number"
                    {...register(`options.${pOindex}.maxQuantity`)}
                    error={
                      errors.options &&
                      errors.options[pOindex] &&
                      errors.options[pOindex].maxQuantity
                    }
                    defaultValue={productOption.maxQuantity}
                  />
                </SimpleGrid>

                {productOption.additionals.map(
                  (additionalProductOption, additionalProductOptionIndex) => (
                    <Flex
                      key={additionalProductOptionIndex}
                      w="100%"
                      alignItems="center"
                      gridGap="6"
                      mt={4}
                    >
                      <FormInput
                        name={`options.${pOindex}.additionals.${additionalProductOptionIndex}.name`}
                        label="Nome"
                        {...register(
                          `options.${pOindex}.additionals.${additionalProductOptionIndex}.name`
                        )}
                        defaultValue={additionalProductOption?.name}
                        maxLength={20}
                        error={
                          errors.options &&
                          errors.options[pOindex] &&
                          errors.options[pOindex].additionals &&
                          errors.options[pOindex].additionals[additionalProductOptionIndex] &&
                          errors.options[pOindex].additionals[additionalProductOptionIndex].name
                        }
                      />
                      <FormInput
                        name={`options.${pOindex}.additionals.${additionalProductOptionIndex}.price`}
                        label="Preço"
                        defaultValue={additionalProductOption?.price}
                        {...register(
                          `options.${pOindex}.additionals.${additionalProductOptionIndex}.price`
                        )}
                        type="number"
                        error={
                          errors.options &&
                          errors.options[pOindex] &&
                          errors.options[pOindex].additionals &&
                          errors.options[pOindex].additionals[additionalProductOptionIndex] &&
                          errors.options[pOindex].additionals[additionalProductOptionIndex].price
                        }
                      />

                      <Button
                        type="button"
                        colorScheme="pink"
                        w="3"
                        justifySelf="flex-end"
                        mt={4}
                        onClick={() =>
                          addProductAdditionalOptions({
                            productOptionindex: pOindex,
                          })
                        }
                      >
                        +
                      </Button>

                      {productOption.additionals.length > 1 && (
                        <Button
                          type="button"
                          colorScheme="red"
                          w="3"
                          justifySelf="flex-end"
                          mt={4}
                          onClick={() =>
                            removeProductAdditionalOptions({
                              productOptionindex: pOindex,
                              additionProductOptionindex: additionalProductOptionIndex,
                            })
                          }
                        >
                          -
                        </Button>
                      )}
                    </Flex>
                  )
                )}

                <Divider my="6" borderColor="gray.700" />
              </Box>
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

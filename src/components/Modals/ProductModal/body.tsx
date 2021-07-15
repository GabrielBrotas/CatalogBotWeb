import React, { useState } from 'react'
import {
  Badge,
  Box,
  DrawerBody,
  Flex,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  VStack,
  Text,
  Button,
} from '@chakra-ui/react'
import { FormButton } from '../../Form/button'
import { FormTextArea } from '../../Form/textarea'
import { OptionAdditional, Product } from '../../../services/apiFunctions/companies/products/types'
import { useClientAuth } from '../../../contexts/AuthClient'
import { useCart } from '../../../contexts/Cart'
import { AddToastProps, useToast } from '../../../contexts/Modals/Toast'
import { formatItemToAddInCart } from '../../../utils/dataFormat'
import { RiShoppingCart2Line } from 'react-icons/ri'
import { AiOutlineLine, AiOutlinePlus } from 'react-icons/ai'
import { useProductModal } from '../../../contexts/Modals/ProductModal'

export type SelectedOptions = {
  selectedAdditionalOptions: {
    _id: string
    name: string
    price: number
    amount: number
  }[]
  _id?: string
  name: string
  isRequired: boolean
  maxQuantity: number
  minQuantity: number
  additionals: OptionAdditional[]
}

interface ProductModalBodyProps {
  activeProduct: Product
}

export const ProductModalBody = ({ activeProduct }: ProductModalBodyProps) => {
  const { isAuthenticated, openModal: openRegisterModal } = useClientAuth()
  const { addToast } = useToast()
  const { addToCart } = useCart()
  const { handleCloseProductModal } = useProductModal()

  const [selectedOptions, setSelectedOptions] = useState(
    activeProduct.options.map((option) => ({
      ...option,
      selectedAdditionalOptions: option.additionals.map((additional) => ({
        _id: additional._id,
        name: additional.name,
        price: additional.price,
        amount: 0,
      })),
    }))
  )
  const [comment, setComment] = useState('')

  async function handleAddToCart() {
    if (!isAuthenticated) {
      openRegisterModal({ type: 'login' })
      return
    }

    const errors: AddToastProps[] = []
    // validate
    selectedOptions.map((option) => {
      if (option.isRequired) {
        let countSelected = 0
        option.selectedAdditionalOptions.map((selectedAdditionalOption) => {
          countSelected += selectedAdditionalOption.amount
        })

        if (countSelected < option.maxQuantity) {
          errors.push({
            title: `Quantidade inválida em ${option.name}`,
            description: `Você escolheu ${countSelected} de ${option.maxQuantity} opções obrigatórias`,
            status: 'error',
          })
        }
      }
    })

    if (errors.length > 0) {
      errors.map((error) => {
        addToast(error)
      })
      return
    }

    const formatedOption = formatItemToAddInCart({
      activeProduct,
      selectedOptions,
      comment,
    })

    try {
      await addToCart(formatedOption)
      addToast({
        title: 'Produto adicionado ao carrinho',
        status: 'success',
      })
      handleCloseProductModal()
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        addToast({
          title: err.response.data.message.message,
          status: 'error',
        })
      } else {
        addToast({
          title: 'Algo deu errado, tente novamente mais tarde',
          status: 'error',
        })
      }
      handleCloseProductModal()
    }
  }

  function handleSingleOptionChange({ optionId, additionalOptionId, value }) {
    setSelectedOptions(
      selectedOptions.map((option) => {
        if (option._id !== optionId) {
          return {
            ...option,
            selectedAdditionalOptions: option.selectedAdditionalOptions.map((additional) => ({
              ...additional,
              amount: Number(additional.amount),
            })),
          }
        }

        return {
          ...option,
          selectedAdditionalOptions: option.selectedAdditionalOptions.map((additional) => ({
            ...additional,
            amount: additional._id === additionalOptionId ? value : 0,
          })),
        }
      })
    )
  }

  function handleMultipleOptionChange({ optionId, additionalOptionId, value }) {
    setSelectedOptions(
      selectedOptions.map((option) => {
        if (option._id !== optionId) {
          return {
            ...option,
            selectedAdditionalOptions: option.selectedAdditionalOptions.map((additional) => ({
              ...additional,
              amount: Number(additional.amount),
            })),
          }
        }

        return {
          ...option,
          selectedAdditionalOptions: option.selectedAdditionalOptions.map((additional) => ({
            ...additional,
            amount:
              additional._id === additionalOptionId
                ? Number(additional.amount) + Number(value) < 0
                  ? Number(additional.amount)
                  : Number(additional.amount) + Number(value)
                : Number(additional.amount),
          })),
        }
      })
    )
  }

  function getTotalAdditionalPicked(selectedAdditionalOptions) {
    const total = selectedAdditionalOptions.reduce(
      (acc, currentOption) => acc + currentOption.amount,
      0
    )

    return total
  }

  return (
    <DrawerBody textColor="gray.700">
      <Heading as="h5" size="lg" my="2" isTruncated>
        {activeProduct.name}
      </Heading>
      <Text mt="1" my="4" maxW="40rem">
        {activeProduct.description}
      </Text>

      <VStack w="full" display="flex" flexDir="column">
        {selectedOptions.map((option) => (
          <Box key={option._id} w="full">
            <Flex
              alignItems="flex-start"
              justifyContent="space-between"
              bg="gray.75"
              borderRadius="md"
              p="2"
            >
              <Box display="flex" flexDir="column">
                <Text mb="2" fontWeight="medium">
                  {option.name}
                </Text>
                <Text>
                  {getTotalAdditionalPicked(option.selectedAdditionalOptions)} de{' '}
                  {option.maxQuantity}
                </Text>
              </Box>

              {option.isRequired && (
                <Badge bg="gray.75" fontSize="sm">
                  Obrigatório
                </Badge>
              )}
            </Flex>

            {option.maxQuantity > 1 ? (
              option.additionals.map((additionalOption) => (
                <Stack key={additionalOption._id} direction="column">
                  <Flex alignItems="center" justifyContent="space-between" p="2" mb="2">
                    <Box>
                      <Text>{additionalOption.name}</Text>
                      {Number(additionalOption.price) > 0 && (
                        <Text>{additionalOption.priceFormated}</Text>
                      )}
                    </Box>
                    <HStack border="1px" borderColor="gray.100" my="4">
                      <Button
                        bg="transparent"
                        _hover={{ bg: 'transparent' }}
                        _focus={{ bg: 'transparent' }}
                        _active={{ bg: '#dddfe2' }}
                        borderRadius="0"
                        onClick={() =>
                          handleMultipleOptionChange({
                            optionId: option._id,
                            additionalOptionId: additionalOption._id,
                            value: -1,
                          })
                        }
                        disabled={
                          getTotalAdditionalPicked(option.selectedAdditionalOptions) <
                          option.minQuantity
                        }
                        cursor="pointer"
                      >
                        <AiOutlineLine size={20} color="#007aff" />
                      </Button>
                      <Input
                        border="none"
                        readOnly
                        min={0}
                        w="3rem"
                        textAlign="center"
                        fontSize="lg"
                        textColor="gray.600"
                        value={
                          option.selectedAdditionalOptions.find(
                            (addOption) => addOption._id === additionalOption._id
                          ).amount
                        }
                        p="0"
                      />
                      <Button
                        bg="transparent"
                        _hover={{ bg: 'transparent' }}
                        _focus={{ bg: 'transparent' }}
                        _active={{ bg: '#dddfe2' }}
                        borderRadius="0"
                        onClick={() =>
                          handleMultipleOptionChange({
                            optionId: option._id,
                            additionalOptionId: additionalOption._id,
                            value: 1,
                          })
                        }
                        disabled={
                          getTotalAdditionalPicked(option.selectedAdditionalOptions) >=
                          option.maxQuantity
                        }
                      >
                        <AiOutlinePlus size={20} color="#007aff" cursor="pointer" />
                      </Button>
                    </HStack>
                  </Flex>
                </Stack>
              ))
            ) : (
              <RadioGroup>
                {option.additionals.map((additionalOption) => (
                  <Stack key={additionalOption._id} direction="column">
                    <Flex alignItems="center" justifyContent="space-between" p="2" mb="2">
                      <Box>
                        <Text>{additionalOption.name}</Text>
                        {Number(additionalOption.price) > 0 && (
                          <Text>{additionalOption.priceFormated}</Text>
                        )}
                      </Box>
                      <Radio
                        value={additionalOption._id}
                        onClick={() =>
                          handleSingleOptionChange({
                            additionalOptionId: additionalOption._id,
                            optionId: option._id,
                            value: 1,
                          })
                        }
                      />
                    </Flex>
                  </Stack>
                ))}
              </RadioGroup>
            )}
          </Box>
        ))}

        <FormTextArea
          name="comments"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          label="Comentário adicional"
          secondary
        />

        <FormButton
          onClick={handleAddToCart}
          w="full"
          h="14"
          leftIcon={<RiShoppingCart2Line size={20} style={{ marginBottom: 5 }} />}
          secondary
        >
          Adicionar ao carrinho
        </FormButton>
      </VStack>
    </DrawerBody>
  )
}

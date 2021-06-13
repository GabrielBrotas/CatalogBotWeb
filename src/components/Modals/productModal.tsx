import {
  Badge,
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useClientAuth } from '../../contexts/AuthClient'
import { useCart } from '../../contexts/Cart'
import { useProductModal } from '../../contexts/ProductModal'
import { AddToastProps, useToast } from '../../contexts/Toast'
import { OrderProduct } from '../../services/apiFunctions/clients/orders/types'
import { OptionAdditional, Product } from '../../services/apiFunctions/companies/products/types'
import { Button } from '../Form/button'
import { FormTextArea } from '../Form/textarea'
import { RegisterOrLoginClient } from './RegisterOrLoginClient'

interface formatItemToOrderProductProps {
  activeProduct: Product
  selectedOptions: {
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
  }[]
  comment?: string
}
function formatItemToOrderProduct({
  activeProduct,
  selectedOptions,
  comment,
}: formatItemToOrderProductProps): OrderProduct {
  return {
    product: activeProduct._id,
    amount: 1,
    pickedOptions: selectedOptions.map((option) => ({
      productOptionName: option.name,
      optionAdditionals: option.selectedAdditionalOptions.filter(
        (selectedAdditionalOption) => selectedAdditionalOption.amount !== 0
      ),
    })),
    comment,
  }
}

export const ProductModal = () => {
  const { isProductModalOpen, handleCloseProductModal, activeProduct } = useProductModal()
  const { isAuthenticated } = useClientAuth()
  const { addToast } = useToast()
  const { addToCart } = useCart()

  const { isOpen, onOpen: openRegisterModal, onClose: closeRegisterModal } = useDisclosure()

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

  const onClose = () => handleCloseProductModal()

  if (!activeProduct) return <></>

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

  async function handleAddToCart() {
    if (!isAuthenticated) {
      openRegisterModal()
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

    const formatedOption = formatItemToOrderProduct({
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
    } finally {
      onClose()
    }
  }

  return (
    <>
      <Drawer placement="bottom" onClose={onClose} isOpen={isProductModalOpen}>
        <DrawerOverlay />
        <DrawerContent h="90%" borderTopRadius="2xl">
          <DrawerHeader borderBottomWidth="1px" w="full" display="flex" justifyContent="center">
            <Image
              boxSize="10rem"
              name={activeProduct.name}
              src={activeProduct.imageUrl ? activeProduct.imageUrl : '/images/default-picture.jpg'}
            />
          </DrawerHeader>
          <DrawerBody textColor="gray.800">
            <Heading as="h5" size="sm" isTruncated>
              {activeProduct.name}
            </Heading>
            <Text mt="1" maxW="40rem">
              {activeProduct.description}
            </Text>

            <VStack w="full" display="flex" flexDir="column">
              {selectedOptions.map((option) => (
                <Box key={option._id} w="full">
                  <Flex alignItems="flex-start" justifyContent="space-between" bg="gray.300" p="2">
                    <Box display="flex" flexDir="column">
                      <Text>{option.name}</Text>
                      <Text>
                        {getTotalAdditionalPicked(option.selectedAdditionalOptions)} de{' '}
                        {option.maxQuantity}
                      </Text>
                    </Box>

                    {option.isRequired && <Badge>Obrigatório</Badge>}
                  </Flex>

                  {option.maxQuantity > 1 ? (
                    option.additionals.map((additionalOption) => (
                      <Stack key={additionalOption._id} direction="column">
                        <Flex alignItems="center" justifyContent="space-between" p="2">
                          <Box>
                            <Text>{additionalOption.name}</Text>
                            <Text>{additionalOption.priceFormated}</Text>
                          </Box>
                          <HStack maxW="320px">
                            <Button
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
                            >
                              -
                            </Button>
                            <Input
                              value={
                                option.selectedAdditionalOptions.find(
                                  (addOption) => addOption._id === additionalOption._id
                                ).amount
                              }
                              readOnly
                              min={0}
                            />
                            <Button
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
                              +
                            </Button>
                          </HStack>
                        </Flex>
                      </Stack>
                    ))
                  ) : (
                    <RadioGroup>
                      {option.additionals.map((additionalOption) => (
                        <Stack key={additionalOption._id} direction="column">
                          <Flex alignItems="center" justifyContent="space-between" p="2">
                            <Box>
                              <Text>{additionalOption.name}</Text>
                              <Text>{additionalOption.priceFormated}</Text>
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
              />

              <Button onClick={handleAddToCart}>Adicionar ao carrinho</Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <RegisterOrLoginClient isOpen={isOpen} closeRegisterModal={closeRegisterModal} />
    </>
  )
}

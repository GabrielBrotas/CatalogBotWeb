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
} from '@chakra-ui/react'
import { FormButton } from '../../Form/button'
import { FormTextArea } from '../../Form/textarea'
import { OptionAdditional, Product } from '../../../services/apiFunctions/companies/products/types'
import { useClientAuth } from '../../../contexts/AuthClient'
import { useCart } from '../../../contexts/Cart'
import { AddToastProps, useToast } from '../../../contexts/Toast'
import { formatItemToAddInCart } from '../../../utils/dataFormat'

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
  const { isAuthenticated, openModal: openRegisterModal, closeModal } = useClientAuth()
  const { addToast } = useToast()
  const { addToCart } = useCart()

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
    } finally {
      closeModal()
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
                      <FormButton
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
                      </FormButton>
                      <Input
                        value={
                          option.selectedAdditionalOptions.find(
                            (addOption) => addOption._id === additionalOption._id
                          ).amount
                        }
                        readOnly
                        min={0}
                      />
                      <FormButton
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
                      </FormButton>
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

        <FormButton onClick={handleAddToCart}>Adicionar ao carrinho</FormButton>
      </VStack>
    </DrawerBody>
  )
}

import {
  Badge,
  Box,
  Checkbox,
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
import { useCatalogModal } from '../../contexts/CatalogModal'
import { Button } from '../Form/button'
import { RegisterClient } from './RegisterClient'

export const ProductModal = () => {
  const { isCatalogModalOpen, handleCloseCatalogModal, activeProduct } = useCatalogModal()

  const { isOpen, onOpen: openRegisterModal, onClose: closeRegisterModal } = useDisclosure()

  const [selectedOption, setSelectedOptions] = useState(
    activeProduct.options.map((option) => ({
      ...option,
      selectedAdditionalOptions: option.additionals.map((additional) => ({
        _id: additional._id,
        name: additional.name,
        quantity: 0,
      })),
    }))
  )

  const onClose = () => handleCloseCatalogModal()

  if (!activeProduct) return <></>

  function handleSingleOptionChange({ optionId, additionalOptionId, value }) {
    setSelectedOptions(
      selectedOption.map((option) => {
        if (option._id !== optionId) {
          return {
            ...option,
            selectedAdditionalOptions: option.selectedAdditionalOptions.map((additional) => ({
              _id: additional._id,
              name: additional.name,
              quantity: Number(additional.quantity),
            })),
          }
        }

        return {
          ...option,
          selectedAdditionalOptions: option.selectedAdditionalOptions.map((additional) => ({
            _id: additional._id,
            name: additional.name,
            quantity: additional._id === additionalOptionId ? value : 0,
          })),
        }
      })
    )
  }

  function handleMultipleOptionChange({ optionId, additionalOptionId, value }) {
    setSelectedOptions(
      selectedOption.map((option) => {
        if (option._id !== optionId) {
          return {
            ...option,
            selectedAdditionalOptions: option.selectedAdditionalOptions.map((additional) => ({
              _id: additional._id,
              name: additional.name,
              quantity: Number(additional.quantity),
            })),
          }
        }

        return {
          ...option,
          selectedAdditionalOptions: option.selectedAdditionalOptions.map((additional) => ({
            _id: additional._id,
            name: additional.name,
            quantity:
              additional._id === additionalOptionId
                ? Number(additional.quantity) + Number(value) < 0
                  ? Number(additional.quantity)
                  : Number(additional.quantity) + Number(value)
                : Number(additional.quantity),
          })),
        }
      })
    )
  }

  function getTotalAdditionalPicked(selectedAdditionalOptions) {
    const total = selectedAdditionalOptions.reduce(
      (acc, currentOption) => acc + currentOption.quantity,
      0
    )

    return total
  }

  function handleAddToCart() {
    openRegisterModal()
  }

  return (
    <>
      <Drawer placement="bottom" onClose={onClose} isOpen={isCatalogModalOpen}>
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
              {selectedOption.map((option) => (
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
                                ).quantity
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

              <Button onClick={handleAddToCart}>Adicionar ao carrinho</Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <RegisterClient isOpen={isOpen} closeRegisterModal={closeRegisterModal} />
    </>
  )
}

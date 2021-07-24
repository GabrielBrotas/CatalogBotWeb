import React, { useCallback, useEffect, useState } from 'react'
import { BsHouse } from 'react-icons/bs'
import { BiCurrentLocation } from 'react-icons/bi'
import { Box, Checkbox, Flex, HStack, Text, Icon } from '@chakra-ui/react'
import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form'

import { FormInput } from '../../../Form/input'

import getAddressByCep from '../../../../utils/location'
import { useClientAuth } from '../../../../contexts/AuthClient'

interface AddressFormProps {
  register: UseFormRegister<FieldValues>
  errors: DeepMap<FieldValues, FieldError>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  loading: boolean
  setValue: UseFormSetValue<FieldValues>
  setError: UseFormSetError<FieldValues>
  clearErrors: UseFormClearErrors<FieldValues>
}

// const options = {
//   enableHighAccuracy: true,
//   timeout: 5000,
//   maximumAge: 0,
// }

// function posSuccess(pos) {
//   const { latitude, longitude } = pos.coords
// }

// function posError(err) {
//   console.warn(`ERROR(${err.code}): ${err.message}`)
// }

let timeout: NodeJS.Timeout
export const AddressForm = ({
  errors,
  register,
  setLoading,
  setValue,
  setError,
  clearErrors,
}: AddressFormProps) => {
  const { client } = useClientAuth()

  const [useDefaultAddress, setUseDefaultAddress] = useState(false)

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.permissions.query({ name: 'geolocation' }).then((result) => {
  //       if (result.state === 'granted') {
  //         navigator.geolocation.getCurrentPosition((pos) => {
  //           const { latitude, longitude } = pos.coords

  //           console.log(latitude, longitude)
  //         })
  //       } else if (result.state === 'prompt') {
  //         navigator.geolocation.getCurrentPosition(
  //           (pos) => {
  //             const { latitude, longitude } = pos.coords

  //             console.log(latitude, longitude)
  //           },
  //           posError,
  //           options
  //         )
  //       } else if (result.state === 'denied') {
  //         //If denied then you have to show instructions to enable location
  //       }
  //       result.onchange = function () {
  //         console.log(result.state)
  //       }
  //     })
  //   } else {
  //     alert('Sorry Not available!')
  //   }
  // }, [])

  useEffect(() => {
    if (useDefaultAddress && client.defaultAddress) {
      clearErrors('deliveryAddress.cep')
      setValue('deliveryAddress.cep', client.defaultAddress.cep)
      setValue('deliveryAddress.number', client.defaultAddress.number)
      setValue('deliveryAddress.street', client.defaultAddress.street)
      setValue('deliveryAddress.neighborhood', client.defaultAddress.neighborhood)
      setValue('deliveryAddress.state', client.defaultAddress.state)
      setValue('deliveryAddress.city', client.defaultAddress.city)
    }
  }, [clearErrors, client.defaultAddress, setValue, useDefaultAddress])

  const handleCEPChanged = useCallback(
    async (cep: string) => {
      setLoading(true)
      try {
        const address = await getAddressByCep(cep)

        clearErrors('deliveryAddress.cep')
        if (address.street) {
          setValue('deliveryAddress.street', address.street)
        }

        if (address.neighborhood) {
          setValue('deliveryAddress.neighborhood', address.neighborhood)
        }

        if (address.state) {
          setValue('deliveryAddress.state', address.state)
        }

        if (address.city) {
          setValue('deliveryAddress.city', address.city)
        }

        setLoading(false)
      } catch (err) {
        setError('deliveryAddress.cep', { message: 'Cep não encontrado!' })

        setLoading(false)
      }
    },
    [clearErrors, setError, setLoading, setValue]
  )

  const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setLoading(true)
    clearTimeout(timeout)

    if (value === '' || value === null) {
      setLoading(false)
      clearErrors('deliveryAddress.cep')
      return
    }
    timeout = setTimeout(() => {
      handleCEPChanged(value)
    }, 1000)
  }

  return (
    <Box alignSelf="flex-start" mt="4">
      <Text fontSize="x-large" fontWeight="medium" mb="4">
        Endereço de entrega
      </Text>

      {client.defaultAddress && Object.keys(client.defaultAddress).length > 0 && (
        <HStack mb="4">
          <Box
            display="flex"
            alignItems="center"
            bg="gray.50"
            p="3"
            borderRadius="2xl"
            border="1px"
            borderColor={useDefaultAddress ? '#007aff' : 'gray.100'}
            cursor="pointer"
            boxShadow="md"
            onClick={() => setUseDefaultAddress(!useDefaultAddress)}
          >
            <Icon as={BsHouse} fontSize="2xl" mr="4" textColor="gray.300" />

            <Flex flexDir="column" textColor="gray.400">
              <Text>
                {client.defaultAddress?.street}, {client.defaultAddress?.number}
              </Text>
              <Text>{client.defaultAddress?.neighborhood}</Text>
              <Text>
                {client.defaultAddress?.city}/{client.defaultAddress?.state}
              </Text>
            </Flex>
          </Box>
        </HStack>
      )}
      <FormInput
        name="cep"
        placeholder="Cep"
        {...register('deliveryAddress.cep')}
        error={errors.deliveryAddress && errors.deliveryAddress.cep}
        containerStyle={{ mb: '4' }}
        secondary
        onChange={handleCepChange}
      />

      <FormInput
        name="state"
        placeholder="Estado"
        {...register('deliveryAddress.state')}
        error={errors.deliveryAddress && errors.deliveryAddress.state}
        containerStyle={{ mb: '4' }}
        secondary
      />

      <FormInput
        name="city"
        placeholder="Cidade"
        {...register('deliveryAddress.city')}
        error={errors.deliveryAddress && errors.deliveryAddress.city}
        containerStyle={{ mb: '4' }}
        secondary
      />

      <FormInput
        name="street"
        placeholder="Endereço"
        {...register('deliveryAddress.street')}
        error={errors.deliveryAddress && errors.deliveryAddress.street}
        containerStyle={{ mb: '4' }}
        secondary
      />

      <FormInput
        name="neighborhood"
        placeholder="Bairro"
        {...register('deliveryAddress.neighborhood')}
        error={errors.deliveryAddress && errors.deliveryAddress.neighborhood}
        containerStyle={{ mb: '4' }}
        secondary
      />

      <FormInput
        name="number"
        placeholder="Numero"
        {...register('deliveryAddress.number')}
        error={errors.deliveryAddress && errors.deliveryAddress.number}
        containerStyle={{ mb: '4' }}
        secondary
      />

      <Checkbox
        colorScheme="blue"
        defaultIsChecked
        size="md"
        mr="2"
        mb="4"
        {...register('saveAddressAsDefault')}
      >
        Salvar este endereço como padrão para as próximas compras
      </Checkbox>
    </Box>
  )
}

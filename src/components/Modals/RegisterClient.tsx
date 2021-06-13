import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  FormControl,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useToast } from '../../contexts/Toast'
import { FormInput } from '../Form/input'
import { signUpClient } from '../../services/apiFunctions/clients/client'
import { useClientAuth } from '../../contexts/AuthClient'
import { Address } from '../../services/apiFunctions/clients/client/types'

interface RegisterClientProps {
  isOpen: boolean
  closeRegisterModal: () => void
}

type SignUpClienFormData = {
  name: string
  email: string
  password: string
  cellphone: string
  defaultAddress: Address
}
const signUpClientFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().email('Insira um e-mail válido'),
  password: yup.string().required('senha obrigatória'),
  cellphone: yup.string().required('Telefone obrigatório'),
  defaultAddress: yup.object().shape({
    state: yup.string(),
    city: yup.string(),
    street: yup.string(),
    neighborhood: yup.string(),
    number: yup.string(),
    cep: yup.string(),
  }),
})

export const RegisterClient = ({ isOpen, closeRegisterModal }: RegisterClientProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signUpClientFormSchema),
  })

  const { addToast } = useToast()
  const { loginClient } = useClientAuth()

  const handleSignInClient: SubmitHandler<SignUpClienFormData> = async (data, event) => {
    event.preventDefault()

    const { email, name, password, cellphone, defaultAddress } = data
    try {
      await signUpClient({ email, name, password, cellphone, defaultAddress })
      await loginClient({ user: cellphone, password })

      addToast({
        title: 'Conta criada com sucesso!',
        description: 'Agora você já pode adicionar itens ao carrinho',
        status: 'success',
      })

      closeRegisterModal()
    } catch (err) {
      addToast({
        title: 'Error',
        description: err.message,
        status: 'error',
      })
    }
  }

  return (
    <>
      <Modal onClose={closeRegisterModal} size="full" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent textColor="gray.600">
          <ModalHeader>Cadastro</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(handleSignInClient)}>
              <Text fontSize="lg" my="4" textAlign="center">
                Faça seu cadastro
              </Text>
              <FormControl isInvalid={errors.name}>
                <FormInput
                  name="name"
                  placeholder="Nome"
                  {...register('name')}
                  error={errors.name}
                  containerStyle={{ mb: '4' }}
                />

                <FormInput
                  name="email"
                  placeholder="E-mail"
                  {...register('email')}
                  error={errors.email}
                  containerStyle={{ mb: '4' }}
                />

                <FormInput
                  name="password"
                  placeholder="Senha"
                  type="password"
                  {...register('password')}
                  error={errors.password}
                  containerStyle={{ mb: '4' }}
                />

                <FormInput
                  name="cellphone"
                  placeholder="Telefone"
                  {...register('cellphone')}
                  error={errors.cellphone}
                  containerStyle={{ mb: '4' }}
                />

                <FormInput
                  name="state"
                  placeholder="Estado"
                  {...register('defaultAddress.state')}
                  error={errors.defaultAddress && errors.defaultAddress.state}
                  containerStyle={{ mb: '4' }}
                />

                <FormInput
                  name="city"
                  placeholder="Cidade"
                  {...register('defaultAddress.city')}
                  error={errors.defaultAddress && errors.defaultAddress.city}
                  containerStyle={{ mb: '4' }}
                />

                <FormInput
                  name="street"
                  placeholder="Endereço"
                  {...register('defaultAddress.street')}
                  error={errors.defaultAddress && errors.defaultAddress.street}
                  containerStyle={{ mb: '4' }}
                />

                <FormInput
                  name="neighborhood"
                  placeholder="Bairro"
                  {...register('defaultAddress.neighborhood')}
                  error={errors.defaultAddress && errors.defaultAddress.neighborhood}
                  containerStyle={{ mb: '4' }}
                />

                <FormInput
                  name="number"
                  placeholder="Numero"
                  {...register('defaultAddress.number')}
                  error={errors.defaultAddress && errors.defaultAddress.number}
                  containerStyle={{ mb: '4' }}
                />

                <FormInput
                  name="cep"
                  placeholder="Cep"
                  {...register('defaultAddress.cep')}
                  error={errors.defaultAddress && errors.defaultAddress.cep}
                  containerStyle={{ mb: '4' }}
                />
              </FormControl>

              <Button mt={4} w="100%" isLoading={isSubmitting} type="submit">
                Cadastrar
              </Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeRegisterModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

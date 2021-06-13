import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react'
import * as yup from 'yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useToast } from '../../../contexts/Toast'
import { signUpClient } from '../../../services/apiFunctions/clients/client'
import { useClientAuth } from '../../../contexts/AuthClient'
import { Address } from '../../../services/apiFunctions/clients/client/types'
import { RegisterForm } from './RegisterForm'
import { LoginForm } from './LoginForm'
import { removeSpeciaCaracteresAndLetters } from '../../../utils/removeSpecialCaracters'

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

type SignInClientFormData = {
  user: string
  password: string
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

const signInClientFormSchema = yup.object().shape({
  user: yup.string().required('Usuario obrigatório'),
  password: yup.string().required('senha obrigatória'),
})

export const RegisterOrLoginClient = ({ isOpen, closeRegisterModal }: RegisterClientProps) => {
  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: signUpErrors, isSubmitting: isSubmittingSignUp },
  } = useForm({
    resolver: yupResolver(signUpClientFormSchema),
  })

  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignin,
    formState: { errors: signInErrors, isSubmitting: isSubmittingSignIn },
  } = useForm({
    resolver: yupResolver(signInClientFormSchema),
  })

  const { addToast } = useToast()
  const { loginClient } = useClientAuth()

  const [formType, setFormType] = useState<'Register' | 'Login'>('Register')

  const handleSignUpClient: SubmitHandler<SignUpClienFormData> = async (data, event) => {
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

  const handleSignInClient: SubmitHandler<SignInClientFormData> = async (data, event) => {
    event.preventDefault()
    const { user, password } = data

    try {
      const userFormated = removeSpeciaCaracteresAndLetters(user).trim()
      await loginClient({ user: userFormated, password })

      addToast({
        title: 'Autenticado com sucesso!',
        description: 'Agora você já pode adicionar itens ao carrinho',
        status: 'success',
      })

      closeRegisterModal()
    } catch (err) {
      addToast({
        title: 'Error',
        description: err.response.data.message,
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
            {formType === 'Register' ? (
              <form onSubmit={handleSubmitSignUp(handleSignUpClient)}>
                <RegisterForm
                  register={registerSignUp}
                  errors={signUpErrors}
                  isSubmitting={isSubmittingSignUp}
                  setFormType={setFormType}
                />
              </form>
            ) : (
              <form onSubmit={handleSubmitSignin(handleSignInClient)}>
                <LoginForm
                  register={registerSignIn}
                  errors={signInErrors}
                  isSubmitting={isSubmittingSignIn}
                  setFormType={setFormType}
                />
              </form>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeRegisterModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

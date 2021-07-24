import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useToast } from '../../../contexts/Modals/Toast'
import { signUpClient } from '../../../services/apiFunctions/clients/client'
import { useClientAuth } from '../../../contexts/AuthClient'
import { Address } from '../../../services/apiFunctions/clients/client/types'
import { RegisterForm } from './RegisterForm'
import { LoginForm } from './LoginForm'
import { removeSpeciaCaracteresAndLetters } from '../../../utils/removeSpecialCaracters'
import { signInClientFormSchema, signUpClientFormSchema } from './schemas'

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

export const RegisterOrLoginClient = () => {
  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: signUpErrors, isSubmitting: isSubmittingSignUp },
    reset: resetSignUp,
  } = useForm({
    resolver: yupResolver(signUpClientFormSchema),
  })

  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignin,
    formState: { errors: signInErrors, isSubmitting: isSubmittingSignIn },
    reset: resetSignIn,
  } = useForm({
    resolver: yupResolver(signInClientFormSchema),
  })

  const { addToast } = useToast()
  const { loginClient, closeModal: closeRegisterModal, isModalOpen, formType } = useClientAuth()

  const handleSignUpClient: SubmitHandler<SignUpClienFormData> = async (data, event) => {
    event.preventDefault()

    const { email, name, password, cellphone, defaultAddress } = data
    try {
      await signUpClient({
        email,
        name,
        password,
        cellphone: String(cellphone)
          .replace(/[^0-9]/gi, '')
          .trim(),
        defaultAddress,
      })
      await loginClient({ user: cellphone, password })

      addToast({
        title: 'Conta criada com sucesso!',
        description: 'Agora você já pode adicionar itens ao carrinho',
        status: 'success',
      })

      resetSignUp()
      resetSignIn()
      closeRegisterModal()
    } catch (err) {
      addToast({
        title: 'Error',
        description: err.response.data.message,
        status: 'error',
      })
    }
  }

  const handleSignInClient: SubmitHandler<SignInClientFormData> = async (data, event) => {
    event.preventDefault()
    const { user, password } = data
    try {
      await loginClient({ user, password })

      addToast({
        title: 'Autenticado com sucesso!',
        description: 'Agora você já pode adicionar itens ao carrinho',
        status: 'success',
      })

      resetSignUp()
      resetSignIn()
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
      <Modal onClose={closeRegisterModal} size="full" isOpen={isModalOpen}>
        <ModalOverlay />
        <ModalContent textColor="gray.600">
          <ModalHeader>{formType === 'register' ? 'Cadastro' : 'Login'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {formType === 'register' ? (
              <form onSubmit={handleSubmitSignUp(handleSignUpClient)}>
                <RegisterForm
                  register={registerSignUp}
                  errors={signUpErrors}
                  isSubmitting={isSubmittingSignUp}
                />
              </form>
            ) : (
              <form onSubmit={handleSubmitSignin(handleSignInClient)}>
                <LoginForm
                  register={registerSignIn}
                  errors={signInErrors}
                  isSubmitting={isSubmittingSignIn}
                />
              </form>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

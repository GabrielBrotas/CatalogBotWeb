import React, { ChangeEvent, useCallback, useState } from 'react'
import { AiOutlineCamera } from 'react-icons/ai'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { Box, Flex, Heading, Avatar, VStack, useBreakpointValue } from '@chakra-ui/react'
import { Sidebar } from '../../../components/Sidebar'
import { CompanyHeader } from '../../../components/Headers/CompanyHeader'
import { FormButton } from '../../../components/Form/button'
import { UpdateProfileProps } from '../../../pages/profile/update'
import { IUpdateCompanyDTO } from '../../../services/apiFunctions/companies/company/types'
import { useToast } from '../../../contexts/Modals/Toast'
import { updateCompany, updateCompanyImage } from '../../../services/apiFunctions/companies/company'
import { CompanyMainDataForm } from './main-data.form'
import { CompanyWorkTimeForm } from './work-time.form'
import { CompanyPaymentMethodsForm } from './payments-method.form'

const updateCompanySchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  shortDescription: yup.string(),
  workTime: yup.array(
    yup.object().shape({
      day: yup.number().required('Dia obrigatório'),
      from: yup.string().required('Horário de início obrigatório'),
      to: yup.string().required('Horário de fechamento obrigatório'),
    })
  ),
  acceptedPaymentMethods: yup.object().shape({
    boleto: yup.boolean().optional(),
    creditCard: yup.boolean().optional(),
    pix: yup.boolean().optional(),
    money: yup.boolean().optional(),
    debit: yup.boolean().optional(),
  }),
})

export const UpdateProfileContainer = ({ company }: UpdateProfileProps) => {
  const router = useRouter()
  const isMobileView = useBreakpointValue({
    base: true,
    lg: false,
  })

  const {
    register,
    handleSubmit,
    clearErrors,
    unregister,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(updateCompanySchema),
    defaultValues: {
      name: company.name,
      shortDescription: company.shortDescription,
      workTime: company.workTime,
      acceptedPaymentMethods: company.acceptedPaymentMethods,
    },
  })
  const { addToast } = useToast()

  const [benefit, setBenefit] = useState('')
  const [companyBenefits, setCompanyBenefits] = useState<string[]>(company.benefits)
  const [companyWorkTime, setCompanyWorkTime] = useState(company.workTime)

  const handleAddNewBenefit = useCallback(() => {
    if (benefit === '' || benefit === null) return

    setCompanyBenefits(companyBenefits.concat(benefit))
    setBenefit('')
  }, [benefit, companyBenefits])

  const handleRemoveBenefit = useCallback(
    (index: number) => {
      setCompanyBenefits(companyBenefits.filter((_, i) => i !== index))
    },
    [companyBenefits]
  )

  const handleAddNewWorkTime = useCallback(() => {
    setCompanyWorkTime(companyWorkTime.concat({ day: 0, from: '00:00', to: '00:00' }))
  }, [companyWorkTime])

  const handleRemoveWorkTime = useCallback(
    (index: number) => {
      setCompanyWorkTime(companyWorkTime.filter((_, i) => i !== index))
      clearErrors()
      unregister([`workTime.${index}`])
    },
    [clearErrors, companyWorkTime, unregister]
  )

  const handleUpdate = useCallback(
    async (data: Omit<IUpdateCompanyDTO, 'benefits'>) => {
      try {
        const { workTime, name, shortDescription, acceptedPaymentMethods } = data
        await updateCompany({
          name,
          shortDescription,
          workTime,
          benefits: companyBenefits,
          acceptedPaymentMethods,
        })

        addToast({
          status: 'success',
          title: 'Dados atualizados',
          description: 'Seus dados foram atualizados com sucesso!',
        })

        router.push('/profile')
      } catch (err) {
        addToast({
          title: 'Error',
          description: err.response.data.message,
          status: 'error',
        })
      }
    },
    [addToast, companyBenefits, router]
  )

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        await updateCompanyImage({
          file: e.target.files[0],
        })

        addToast({
          status: 'success',
          title: 'Avatar atualizado!',
          description: 'Seu avatar foi atualizado com sucesso!',
        })
        router.push('/profile')
      }
    },
    [addToast, router]
  )

  return (
    <Box>
      <CompanyHeader />

      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Meu perfil
            </Heading>
          </Flex>

          <Box>
            <Box position="relative" w="8rem">
              <Avatar size="2xl" name={company.name} src={company.mainImageUrl} />

              <Box
                as="label"
                htmlFor="image"
                bg="gray.300"
                borderRadius="full"
                p="3"
                position="absolute"
                bottom="0"
                right="0"
                cursor="pointer"
              >
                <AiOutlineCamera size={24} />
                <input
                  style={{ display: 'none' }}
                  type="file"
                  id="image"
                  onChange={handleAvatarChange}
                />
              </Box>
            </Box>

            <VStack as="form" onSubmit={handleSubmit(handleUpdate)} spacing="6" mt={6}>
              <CompanyMainDataForm
                register={register}
                errors={errors}
                benefit={benefit}
                setBenefit={setBenefit}
                companyBenefits={companyBenefits}
                handleAddNewBenefit={handleAddNewBenefit}
                handleRemoveBenefit={handleRemoveBenefit}
              />

              <CompanyWorkTimeForm
                companyWorkTime={companyWorkTime}
                handleAddNewWorkTime={handleAddNewWorkTime}
                handleRemoveWorkTime={handleRemoveWorkTime}
                register={register}
              />

              <CompanyPaymentMethodsForm register={register} />

              <Flex justifyContent="flex-end" w="full">
                <FormButton
                  bg="gray.300"
                  type="submit"
                  alignSelf="flex-end"
                  w={isMobileView ? '100%' : '10rem'}
                  isLoading={isSubmitting}
                  mr="6"
                >
                  Cancelar
                </FormButton>

                <FormButton
                  type="submit"
                  alignSelf="flex-end"
                  w={isMobileView ? '100%' : '10rem'}
                  isLoading={isSubmitting}
                >
                  Atualizar
                </FormButton>
              </Flex>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}

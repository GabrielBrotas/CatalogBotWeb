import React, { ChangeEvent, useCallback, useState } from 'react'
import { AiOutlineCamera } from 'react-icons/ai'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { Box, Flex, Heading, Text, Avatar, VStack, useBreakpointValue } from '@chakra-ui/react'
import { Sidebar } from '../../../components/Sidebar'
import { Header } from '../../../components/Header'
import { FormInput } from '../../../components/Form/input'
import { FormTextArea } from '../../../components/Form/textarea'
import { CompanyBenefitsTag } from '../../../components/Tags/companyBenefitsTag'
import { FormSelect } from '../../../components/Form/select'
import { Button } from '../../../components/Form/button'
import { UpdateProfileProps } from '../../../pages/profile/update'
import { hours, weekDays } from '../../../configs/dateTime'
import { IUpdateCompanyDTO } from '../../../services/apiFunctions/companies/company/types'
import { useToast } from '../../../contexts/Toast'
import { updateCompany, updateCompanyImage } from '../../../services/apiFunctions/companies/company'

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
        const { workTime, name, shortDescription } = data
        await updateCompany({ name, shortDescription, workTime, benefits: companyBenefits })

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
      <Header />

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
              <FormInput
                name="name"
                label="Nome da empresa"
                {...register('name')}
                error={errors.name}
                defaultValue={company.name}
              />
              <FormTextArea
                name="shortDescription"
                label="Descrição curta"
                {...register('shortDescription')}
                error={errors.shortDescription}
                defaultValue={company.shortDescription}
              />

              <Box display="flex" alignItems="flex-end" alignSelf="flex-start">
                <FormInput
                  name="benefits"
                  label="Beneficios"
                  w="100%"
                  maxWidth="20rem"
                  value={benefit}
                  onChange={(e) => setBenefit(e.target.value)}
                />
                <Button
                  type="button"
                  colorScheme="pink"
                  w="5"
                  marginLeft="1rem"
                  padding="1.5rem"
                  onClick={handleAddNewBenefit}
                >
                  +
                </Button>
              </Box>

              <CompanyBenefitsTag
                handleRemoveBenefit={handleRemoveBenefit}
                tags={companyBenefits}
                canRemove={true}
              />

              <Flex w="100%" flexDir="column" mt={10}>
                <Flex justify="space-between" mb={4}>
                  <Text color="gray.300" fontSize="2xl">
                    Horário de funcionamento
                  </Text>
                  <Button
                    type="button"
                    colorScheme="pink"
                    marginLeft="1rem"
                    padding="1.5rem"
                    onClick={handleAddNewWorkTime}
                  >
                    Adicionar novo dia
                  </Button>
                </Flex>
                {companyWorkTime.map((workDay, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p="2"
                    bg="gray.600"
                    borderRadius="lg"
                    mb={1}
                  >
                    <FormSelect
                      name={`${workDay.day}${index}`}
                      options={weekDays}
                      defaultValue={workDay.day}
                      maxW="12rem"
                      {...register(`workTime.${index}.day`)}
                    />

                    <Flex>
                      <FormSelect
                        minW="7rem"
                        name={`${workDay.from}${index}`}
                        options={hours}
                        defaultValue={workDay.from}
                        containerStyle={{ mr: '4' }}
                        {...register(`workTime.${index}.from`)}
                      />
                      <FormSelect
                        minW="7rem"
                        name={`${workDay.to}${index}`}
                        options={hours}
                        defaultValue={workDay.to}
                        containerStyle={{ mr: '4' }}
                        {...register(`workTime.${index}.to`)}
                      />
                    </Flex>

                    <Button
                      type="button"
                      colorScheme="red"
                      w="3"
                      justifySelf="flex-end"
                      onClick={() => handleRemoveWorkTime(index)}
                    >
                      -
                    </Button>
                  </Box>
                ))}
              </Flex>
              <Button
                type="submit"
                alignSelf="flex-end"
                w={isMobileView ? '100%' : '10rem'}
                isLoading={isSubmitting}
              >
                Atualizar
              </Button>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}

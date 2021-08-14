import React, { useCallback, useState } from 'react'
import { AiOutlineCamera } from 'react-icons/ai'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { string, object, array, number, boolean } from 'yup'

import { v4 as uuidV4 } from 'uuid'

import {
  Box,
  Flex,
  Heading,
  Avatar,
  VStack,
  useBreakpointValue,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
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
import Link from 'next/link'
import { dataURLtoFile, readFile } from '../../../utils/upload'
import { CropModal } from '../../../components/Upload/CropModal'

interface OnFinishCropProps {
  base64: string
  data: { width: number; height: number; x: number; y: number }
}

const updateCompanySchema = object().shape({
  name: string().required('Nome obrigatório'),
  shortDescription: string(),
  workTime: array(
    object().shape({
      day: number().required('Dia obrigatório'),
      from: string().required('Horário de início obrigatório'),
      to: string().required('Horário de fechamento obrigatório'),
    })
  ),
  acceptedPaymentMethods: object().shape({
    boleto: boolean().optional(),
    creditCard: boolean().optional(),
    pix: boolean().optional(),
    money: boolean().optional(),
    debit: boolean().optional(),
  }),
})

export const UpdateProfileContainer = ({ company }: UpdateProfileProps) => {
  const router = useRouter()
  const isMobileView = useBreakpointValue({
    base: true,
    lg: false,
  })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [src, setSrc] = useState(null)
  const [extension, setExtension] = useState(null)

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
      unregister([`workTime.${index}` as const])
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

  // avatar ---
  const onSelectFile = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const imageDataUrl = await readFile(file)

      setSrc(imageDataUrl)
      setExtension(file.type.split('/')[1])
      onOpen()
    }
  }

  const cancelCrop = () => {
    setSrc(null)
    onClose()
  }

  const onFinishCrop = ({ base64 }: OnFinishCropProps) => {
    const file = dataURLtoFile(base64, `${uuidV4()}.${extension}`)
    handleAvatarChange(file)
    onClose()
  }

  const handleAvatarChange = useCallback(
    async (file: File) => {
      await updateCompanyImage({
        file,
      })

      addToast({
        status: 'success',
        title: 'Avatar atualizado!',
        description: 'Seu avatar foi atualizado com sucesso!',
      })
      router.push('/profile')
    },
    [addToast, router]
  )

  return (
    <>
      <Box w={['max-content', '100%']}>
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
                    onChange={(files) => onSelectFile(files)}
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
                  <Link href="/profile" passHref>
                    <Button
                      colorScheme="whiteAlpha"
                      type="button"
                      alignSelf="flex-end"
                      w={isMobileView ? '100%' : '10rem'}
                      isLoading={isSubmitting}
                      mr="6"
                    >
                      Cancelar
                    </Button>
                  </Link>

                  <FormButton
                    type="submit"
                    alignSelf="flex-end"
                    w={isMobileView ? '100%' : '10rem'}
                    isLoading={isSubmitting}
                    colorScheme="pink"
                  >
                    Atualizar
                  </FormButton>
                </Flex>
              </VStack>
            </Box>
          </Box>
        </Flex>
      </Box>

      <CropModal src={src} isOpen={isOpen} onClose={cancelCrop} onFinishCrop={onFinishCrop} />
    </>
  )
}

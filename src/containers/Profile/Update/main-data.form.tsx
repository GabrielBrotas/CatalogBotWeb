import { Box, Button } from '@chakra-ui/react'
import React from 'react'
import { DeepMap, FieldError, UseFormRegister } from 'react-hook-form'
import { FormInput } from '../../../components/Form/input'
import { FormTextArea } from '../../../components/Form/textarea'
import { CompanyBenefitsTag } from '../../../components/Tags/companyBenefitsTag'
import {
  CompanyPaymentMethods,
  CompanyWorkTime,
} from '../../../services/apiFunctions/companies/company/types'

interface CompanyMainDataFormProps {
  register: UseFormRegister<{
    name: string
    shortDescription: string
    workTime: CompanyWorkTime[]
    acceptedPaymentMethods: CompanyPaymentMethods
  }>
  errors: DeepMap<
    {
      name: string
      shortDescription: string
      workTime: CompanyWorkTime[]
      acceptedPaymentMethods: CompanyPaymentMethods
    },
    FieldError
  >
  benefit: string
  setBenefit: React.Dispatch<React.SetStateAction<string>>
  handleAddNewBenefit: () => void
  handleRemoveBenefit: (index: number) => void
  companyBenefits: string[]
}

export const CompanyMainDataForm = ({
  errors,
  register,
  benefit,
  setBenefit,
  handleAddNewBenefit,
  companyBenefits,
  handleRemoveBenefit,
}: CompanyMainDataFormProps) => {
  return (
    <>
      <FormInput name="name" label="Nome da empresa" {...register('name')} error={errors.name} />
      <FormTextArea
        name="shortDescription"
        label="Descrição curta"
        {...register('shortDescription')}
        error={errors.shortDescription}
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
    </>
  )
}

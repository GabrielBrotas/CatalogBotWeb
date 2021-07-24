import React from 'react'
import { Box, Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import { UseFormRegister } from 'react-hook-form'
import { FormSelect } from '../../../components/Form/select'
import {
  CompanyPaymentMethods,
  CompanyWorkTime,
} from '../../../services/apiFunctions/companies/company/types'
import { hours, weekDays } from '../../../configs/dateTime'

interface CompanyWorkTimeFormProps {
  register: UseFormRegister<{
    name: string
    shortDescription: string
    workTime: CompanyWorkTime[]
    acceptedPaymentMethods: CompanyPaymentMethods
  }>
  handleAddNewWorkTime: () => void
  handleRemoveWorkTime: (index: number) => void
  companyWorkTime: CompanyWorkTime[]
}

export const CompanyWorkTimeForm = ({
  register,
  companyWorkTime,
  handleAddNewWorkTime,
  handleRemoveWorkTime,
}: CompanyWorkTimeFormProps) => {
  const isMobileView = useBreakpointValue({
    base: true,
    md: false,
    lg: false,
  })

  return (
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
          flexDirection={isMobileView ? 'column' : 'row'}
        >
          <FormSelect
            name={`${workDay.day}${index}`}
            options={weekDays}
            defaultValue={workDay.day}
            maxW={!isMobileView ? '12rem' : null}
            mb={isMobileView ? '2' : '0'}
            {...register(`workTime.${index}.day` as const)}
          />

          <Flex w={isMobileView ? '100%' : null} mb={isMobileView ? '2' : null}>
            <FormSelect
              minW="7rem"
              name={`${workDay.from}${index}`}
              options={hours}
              defaultValue={workDay.from}
              containerStyle={{ mr: '4' }}
              {...register(`workTime.${index}.from` as const)}
            />
            <FormSelect
              minW="7rem"
              name={`${workDay.to}${index}`}
              options={hours}
              defaultValue={workDay.to}
              containerStyle={{ mr: isMobileView ? '0' : '4' }}
              {...register(`workTime.${index}.to` as const)}
            />
          </Flex>

          <Button
            type="button"
            colorScheme="red"
            w={isMobileView ? '24' : '3'}
            ml={isMobileView ? 'auto' : '0'}
            justifySelf="flex-end"
            onClick={() => handleRemoveWorkTime(index)}
          >
            -
          </Button>
        </Box>
      ))}
    </Flex>
  )
}

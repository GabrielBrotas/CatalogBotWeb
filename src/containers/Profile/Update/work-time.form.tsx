import React from 'react'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
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
        >
          <FormSelect
            name={`${workDay.day}${index}`}
            options={weekDays}
            defaultValue={workDay.day}
            maxW="12rem"
            {...register(`workTime.${index}.day` as const)}
          />

          <Flex>
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
              containerStyle={{ mr: '4' }}
              {...register(`workTime.${index}.to` as const)}
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
  )
}

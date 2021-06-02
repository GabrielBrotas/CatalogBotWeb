import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import { CompanyWorkTime } from '../../../../services/apiFunctions/company/types';
import { weekDayFormat } from '../../../../configs/dateTime';

interface WorkTimeProps {
  workTime: CompanyWorkTime[];
}

export const WorkTime = ({ workTime }: WorkTimeProps) => {

  return (
    <Flex w="100%" flexDir="column" mt={10}>
      <Text color="gray.300" fontSize="2xl">
        Horário de funcionamento
      </Text>

      {workTime.map((workDay, index) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p="3"
          bg="gray.600"
          marginRight={4}
          borderRadius="lg"
          mb={1}
          key={index}
        >
          <Text color="gray.300" fontSize="md">
            {weekDayFormat[workDay.day]}
          </Text>
          <Text color="gray.300" fontSize="md">
            {workDay.from} - {workDay.to}
          </Text>
        </Box>
      ))}
    </Flex>
  );
};

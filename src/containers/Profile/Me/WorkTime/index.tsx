import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';

export const WorkTime = () => {
  return (
    <Flex w="100%" flexDir="column" mt={10}>
      <Text color="gray.300" fontSize="2xl">
        Horário de funcionamento
      </Text>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p="3"
        bg="gray.600"
        marginRight={4}
        borderRadius="lg"
      >
        <Text color="gray.300" fontSize="md">
          Domingo
        </Text>
        <Text color="gray.300" fontSize="md">
          07:25 - 17:30
        </Text>
      </Box>
    </Flex>
  );
};

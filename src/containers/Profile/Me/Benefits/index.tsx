import { Flex, Tag } from '@chakra-ui/react';
import React from 'react';

export const Benefits = () => {
  return (
    <Flex flexWrap="wrap" w="100%" mt={6}>
      <Tag size="lg" variant="subtle" borderRadius="full">
        Entrega grátis apartir de R$18,00
      </Tag>
    </Flex>
  );
};

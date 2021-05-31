import React from 'react';
import {
  Avatar,
  Box,
  SimpleGrid,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

export const HeaderInfo = () => {
  const isMobileView = useBreakpointValue({
    base: true,
    lg: false,
  });

  return (
    <SimpleGrid
      templateColumns={`${isMobileView ? '1fr' : '5rem 1fr'}`}
      minChildWidth="100px"
      gridGap="12"
      w="100%"
    >
      <Avatar size="2xl" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />

      <Box marginLeft="6" display="flex" flexDir="column">
        <Text color="gray.300" isTruncated fontSize="2xl">
          My company name
        </Text>
        <Text color="gray.300" isTruncated fontSize="xl" mt={1}>
          asdsad@dsad.com
        </Text>

        <Text color="gray.300" fontSize="xl" mt={4}>
          Lorem ipsum is placeholder text commonly used in the graphic, print,
          and publishing industries for previewing layouts and visual mockups.
          Lorem ipsum is placeholder text commonly used in the graphic, print,
          and publishing industries for previewing layouts and visual mockups.
          Lorem ipsum is placeholder text commonly used in the graphic, print,
          and publishing industries for previewing layouts and visual mockups.
        </Text>
      </Box>
    </SimpleGrid>
  );
};

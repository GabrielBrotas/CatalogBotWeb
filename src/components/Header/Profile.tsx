import { Avatar, Box, Text, Flex } from "@chakra-ui/react";
import React from "react";

interface ProfileProps {
  mobileView: boolean;
}

export function Profile({mobileView}: ProfileProps) {
    return (
        <Flex align="center">
            {!mobileView && (
              <Box mr="2">
                <Text>Gabriel Brotas</Text>
                <Text
                  color="gray.300"
                  fontSize="small"
                >
                  gabrielbrotas22@gmail.com
                </Text>
              </Box>
            )}

            <Avatar size="md" name="Gabriel Brotas" src="https://github.com/GabrielBrotas.png" />
        </Flex>
    )
}
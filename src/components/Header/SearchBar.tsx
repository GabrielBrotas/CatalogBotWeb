import { Flex, Icon, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { RiSearchLine } from "react-icons/ri";

export function SearchBar() {
    const [search, setSearch] = useState('');
    
    return (
        <Flex
            as="label"
            flex="1"
            py="4"
            px="8"
            ml="6"
            maxWidth={600}
            alignSelf="center"
            color="gray.200"
            bg="gray.800"
            borderRadius="full"
            position="relative"
        >
            <Input 
                color="gray.50"
                variant="unstyled"
                placeholder="Buscar na plataforma"
                _placeholder={{color: 'gray.400'}}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        <Icon as={RiSearchLine} fontSize="20" />
    </Flex>
)
}
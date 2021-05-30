import React from "react";
import { ElementType } from "react";
import { Icon, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from 'next/link'
import { ActiveLink } from "../ActiveLink";

interface NavLinkProps {
    title: string;
    href: string;
    icon: ElementType;
}

export function NavLink({ title, href, icon }: NavLinkProps) {
    return (
        // como o proximo elemento dentro do link não é um a passamos o atributto passHref para forçar o proximo elemento ter os tipos que uma tag a deveria ter, para quando passar o mouse em cima do link mostrar no footer do navegador para qual link vai ser redirecionado
        <ActiveLink href={href} passHref>
            <ChakraLink display="flex" align="center">
                <Icon as={icon} fontSize="20" />
                <Text ml="4" fontWeight="medium">{title}</Text>
            </ChakraLink>
        </ActiveLink>
    )
}
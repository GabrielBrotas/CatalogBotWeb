import React, { useCallback } from 'react';
import Link from 'next/link';
import { FiLogIn } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Box, Flex, FormControl, Image, Text } from '@chakra-ui/react';
import { FormInput } from '../../components/Form/input';
import { Button } from '../../components/Form/button';

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
};

const signUpFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup
    .string()
    .required('e-mail obrigatório')
    .email('Insira um e-mail válido'),
  password: yup.string().required('senha obrigatória'),
});

export const SignUpContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signUpFormSchema),
  });

  const handleSignIn = useCallback(async (data: SignUpFormData) => {}, []);

  return (
    <Box height="100vh" display="flex" alignItems="center" justify="between">
      <Flex flex="1" height="100vh">
        <img
          src="/images/sign-in-background.png"
          alt="welcome"
          height="100%"
          style={{ objectFit: 'cover', marginRight: 'auto' }}
        />
      </Flex>
      <Flex
        flexDir="column"
        alignItems="center"
        justify="center"
        w="100%"
        maxW="700px"
      >
        <Flex flexDir="column" alignItems="center" justify="center">
          <Image src="/svgs/logo.svg" alt="logo" />

          <form onSubmit={handleSubmit(handleSignIn)}>
            <Text fontSize="lg" my="4" textAlign="center">
              Faça seu cadastro
            </Text>
            <FormControl isInvalid={errors.name}>
              <FormInput
                name="name"
                placeholder="Nome da empresa"
                {...register('name')}
                error={errors.name}
                containerStyle={{ mb: '4' }}
              />

              <FormInput
                name="email"
                placeholder="E-mail"
                {...register('email')}
                error={errors.email}
                containerStyle={{ mb: '4' }}
              />

              <FormInput
                name="password"
                placeholder="Senha"
                type="password"
                {...register('password')}
                error={errors.password}
                containerStyle={{ mb: '4' }}
              />
            </FormControl>

            <Button mt={4} w="100%" isLoading={isSubmitting} type="submit">
              Cadastrar
            </Button>
          </form>

          <Link href="/forgot-password" passHref>
            <Text fontSize="md" my="4" textAlign="center" cursor="pointer">
              Esqueci minha senha
            </Text>
          </Link>

          <Link href="/login" passHref>
            <Flex alignItems="center" justify="center" cursor="pointer">
              <FiLogIn style={{ marginRight: '1rem' }} />
              <Text fontSize="md" textAlign="center" cursor="pointer">
                Já tenho uma conta
              </Text>
            </Flex>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};
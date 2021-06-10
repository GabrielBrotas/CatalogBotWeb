import React, { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiLogIn } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Box, Flex, FormControl, Image, Text } from '@chakra-ui/react';
import { FormInput } from '../../components/Form/input';
import { Button } from '../../components/Form/button';
import { signInCompany } from '../../services/apiFunctions/company';
import { useToast } from '../../contexts/Toast';
import { useCompanyAuth } from '../../contexts/AuthCompany';

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup
    .string()
    .required('e-mail obrigatório')
    .email('Insira um e-mail válido'),
  password: yup.string().required('senha obrigatória'),
});

export const LoginContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const { addToast } = useToast();
  const { loginCompany } = useCompanyAuth();

  const handleSignIn = useCallback(async (data: SignInFormData) => {
    try {
      const { email, password } = data;
      await loginCompany({ email, password });
    } catch (err) {
      addToast({
        title: 'Error',
        description: err.response.data.message,
        status: 'error',
      });
    }
  }, []);

  return (
    <Box height="100vh" display="flex" alignItems="center" justify="between">
      <Flex
        flexDir="column"
        alignItems="center"
        justify="center"
        width="100%"
        maxW="700px"
      >
        <Flex flexDir="column" alignItems="center" justify="center">
          <Image src="/svgs/logo.svg" alt="logo" />

          <form onSubmit={handleSubmit(handleSignIn)}>
            <Text fontSize="lg" my="4" textAlign="center">
              Faça seu logon
            </Text>
            <FormControl isInvalid={errors.name}>
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
              Entrar
            </Button>
          </form>

          <Link href="/forgot-password" passHref>
            <Text fontSize="md" my="4" textAlign="center" cursor="pointer">
              Esqueci minha senha
            </Text>
          </Link>

          <Link href="/signup" passHref>
            <Flex alignItems="center" justify="center" cursor="pointer">
              <FiLogIn style={{ marginRight: '1rem' }} />
              <Text fontSize="md" my="4" textAlign="center" cursor="pointer">
                Criar conta
              </Text>
            </Flex>
          </Link>
        </Flex>
      </Flex>

      <Flex flex="1" height="100vh">
        <img
          src="/images/sign-in-background.png"
          alt="welcome"
          height="100%"
          style={{ objectFit: 'cover', marginLeft: 'auto' }}
        />
      </Flex>
    </Box>
  );
};

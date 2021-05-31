import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Text,
  useBreakpointValue,
  Avatar,
  Tag,
  SimpleGrid,
  AvatarBadge,
  VStack,
} from '@chakra-ui/react';
import { Sidebar } from '../../../components/Sidebar';
import { AiOutlineCamera } from 'react-icons/ai';
import { Header } from '../../../components/Header';
import { FormInput } from '../../../components/Form/input';
import { FormTextArea } from '../../../components/Form/textarea';
import { CompanyBenefitsTag } from '../../../components/Tags/companyBenefitsTag';
import { FormSelect } from '../../../components/Form/select';

const updateCompanySchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  price: yup.string().required('Valor obrigatório'),
  description: yup.string(),
  categoryId: yup.string().required('Categoria obrigatória'),
  options: yup.array(
    yup.object({
      name: yup.string().required('Nome da opção obrigatório'),
      isRequired: yup.boolean(),
      maxQuantity: yup.string().required('Quantidade maxima obrigatório'),
      minQuantity: yup.string().required('Quantidade mínima obrigatório'),
      additionals: yup.array(
        yup.object({
          name: yup.string().required('Nome obrigatório'),
          price: yup.string().required('Valor obrigatório'),
        }),
      ),
    }),
  ),
});

export const UpdateProfileContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(updateCompanySchema),
  });

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Meu perfil
            </Heading>
          </Flex>

          <Box>
            <Box position="relative" w="8rem">
              <Avatar
                size="2xl"
                name="Dan Abrahmov"
                src="https://bit.ly/dan-abramov"
              />
              <Box
                bg="gray.300"
                borderRadius="full"
                p="3"
                position="absolute"
                bottom="0"
                right="0"
                cursor="pointer"
              >
                <AiOutlineCamera size={24} />
              </Box>
            </Box>

            <VStack spacing="6" mt={6}>
              <FormInput
                name="name"
                label="Nome da empresa"
                {...register('name')}
                error={errors.name}
              />
              <FormTextArea
                name="description"
                label="Descrição curta"
                {...register('description')}
                error={errors.description}
              />

              <Box display="flex" alignItems="flex-end" alignSelf="flex-start">
                <FormInput
                  name="tags"
                  label="Beneficios"
                  w="100%"
                  maxWidth="20rem"
                  {...register('tags')}
                  error={errors.tags}
                />
                <Button
                  type="button"
                  colorScheme="pink"
                  w="5"
                  marginLeft="1rem"
                  padding="1.5rem"
                >
                  +
                </Button>
              </Box>

              <CompanyBenefitsTag tags={['Entrega gratis']} canRemove={true} />

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

                  <Flex>
                    <FormSelect
                      name="from"
                      options={[{ label: '07:00', value: 7 }]}
                      containerStyle={{ mr: '4' }}
                    />
                    <FormSelect
                      name="to"
                      options={[{ label: '07:00', value: 7 }]}
                    />
                  </Flex>
                </Box>
              </Flex>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

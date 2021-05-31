import { Flex, SimpleGrid, Box, Text, theme } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { Chart } from './chart';

const options = {
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500],
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: theme.colors.gray[600],
    },
    categories: [
      '2021-03-18T00:00:00.000Z',
      '2021-03-19T00:00:00.000Z',
      '2021-03-20T00:00:00.000Z',
      '2021-03-21T00:00:00.000Z',
      '2021-03-22T00:00:00.000Z',
      '2021-03-23T00:00:00.000Z',
      '2021-03-24T00:00:00.000Z',
    ],
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
};

const series = [
  {
    name: 'series 1',
    data: [31, 120, 10, 28, 61, 70, 100],
  },
];

export const DashboardContainer = () => {
  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" my="6" maxWidth="auto" px="6">
        <Sidebar />

        {/* o minChildWidht vai fazer com que se o elemento ter menos de 320px de largura vai jogar ele para baixo, deixando responsivo */}
        <SimpleGrid flex="1" gap="4" minChildWidth="320px" align="flex-start">
          <Chart title="Inscritos semanais" options={options} series={series} />
          <Chart title="Taxa de abertura" options={options} series={series} />
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};
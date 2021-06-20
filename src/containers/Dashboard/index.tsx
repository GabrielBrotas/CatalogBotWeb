import { Flex, SimpleGrid, theme } from '@chakra-ui/react'
import React from 'react'

import { CompanyHeader } from '../../components/Headers/CompanyHeader'
import { Section } from '../../components/Section'
import { Sidebar } from '../../components/Sidebar'
import { Chart } from './chart'

const options: ApexCharts.ApexOptions = {
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
}

const series = [
  {
    name: 'series 1',
    data: [31, 120, 10, 28, 61, 70, 100],
  },
]

export const DashboardContainer = () => {
  return (
    <Flex direction="column" h="100vh">
      <CompanyHeader />

      <Section>
        <Flex w="100%" my="6" maxWidth="auto" px="6">
          <Sidebar />

          {/* o minChildWidht vai fazer com que se o elemento ter menos de 320px de largura vai jogar ele para baixo, deixando responsivo */}
          <SimpleGrid flex="1" gap="4" columns={1} align="flex-start">
            <Chart title="Visitas ao catalogo" options={options} series={series} />
            <Chart title="Quantidade de ordens" options={options} series={series} />
          </SimpleGrid>
        </Flex>
      </Section>
    </Flex>
  )
}

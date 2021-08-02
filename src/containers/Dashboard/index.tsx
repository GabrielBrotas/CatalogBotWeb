import React from 'react'
import { Flex, SimpleGrid, theme } from '@chakra-ui/react'

import { CompanyHeader } from '../../components/Headers/CompanyHeader'
import { Section } from '../../components/Section'
import { Sidebar } from '../../components/Sidebar'
import { groupDataAnalysisByDate } from '../../utils/dataFormat'
import { Chart } from './chart'
import { DashboardProps } from '../../pages/dashboard'

const chartOptions = (dates: string[] | Date[]): ApexCharts.ApexOptions => {
  return {
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
      enabled: true,
      theme: 'dark',
    },
    xaxis: {
      type: 'datetime',
      axisBorder: {
        color: theme.colors.gray[600],
      },
      categories: dates,
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
}

export const DashboardContainer = ({ dataAnalysis }: DashboardProps) => {
  const chartVisitsToCatalog = React.useMemo(() => {
    if (dataAnalysis) {
      return {
        options: chartOptions(
          dataAnalysis.visit.dates.length === 0 ? [] : dataAnalysis.visit.dates
        ),
        series: [
          {
            name: 'Qtd',
            data: dataAnalysis.visit.datas.length === 0 ? [] : dataAnalysis.visit.datas,
          },
        ],
      }
    }
    return {
      options: chartOptions([]),
      series: [{}],
    }
  }, [dataAnalysis])

  const chartOrdersCount = React.useMemo(() => {
    if (dataAnalysis) {
      return {
        options: chartOptions(
          dataAnalysis.order.dates.length === 0 ? [] : dataAnalysis.order.dates
        ),
        series: [
          {
            name: 'Qtd',
            data: dataAnalysis.order.datas.length === 0 ? [] : dataAnalysis.order.datas,
          },
        ],
      }
    }
    return {
      options: chartOptions([]),
      series: [{}],
    }
  }, [dataAnalysis])

  return (
    <Flex direction="column" h="100vh" w={['100%']}>
      <CompanyHeader />

      <Section>
        <Flex w="100%" my="6" maxWidth="auto" px="6">
          <Sidebar />

          {/* o minChildWidht vai fazer com que se o elemento ter menos de 320px de largura vai jogar ele para baixo, deixando responsivo */}
          <SimpleGrid flex="1" gap="4" columns={1} align="flex-start">
            <Chart
              title="Visitas ao catalogo"
              options={chartVisitsToCatalog.options}
              series={chartVisitsToCatalog.series}
            />
            <Chart
              title="Quantidade de ordens"
              options={chartOrdersCount.options}
              series={chartOrdersCount.series}
            />
          </SimpleGrid>
        </Flex>
      </Section>
    </Flex>
  )
}

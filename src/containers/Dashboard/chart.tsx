import { Box, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartProps {
  title: string;
  options: ApexCharts.ApexOptions;
  series: any[];
}

export const Chart = ({ options, series, title }: ChartProps) => {
  return (
    <Box p={['6', '8']} bg="gray.800" pb="4" borderRadius={8}>
      <Text fontSize="lg" mb="4">
        {title}
      </Text>
      <ApexChart type="area" height={160} options={options} series={series} />
    </Box>
  );
};

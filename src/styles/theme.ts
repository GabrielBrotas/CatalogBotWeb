import { extendTheme } from '@chakra-ui/react'

export type ThemeProps = {
  bg?: string
  color?: string
}

export const theme = ({ bg = 'gray.900', color = 'gray.50' }: ThemeProps) =>
  extendTheme({
    colors: {
      gray: {
        '900': '#181B23',
        '800': '#1F2029',
        '700': '#353646',
        '600': '#4B4D63',
        '500': '#616480',
        '400': '#797D9A',
        '300': '#9699B0',
        '200': '#B3B5C6',
        '100': '#D1D2DC',
        '75': '#EEEEF2',
        '50': '#f7f7f7',
      },
    },
    fonts: {
      heading: 'Roboto',
      body: 'Roboto',
    },
    styles: {
      global: {
        body: {
          bg, //background do app ser esse cinza
          color, // cor do texto esse cinza
        },
      },
    },
  })

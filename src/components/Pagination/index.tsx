import { Box, Stack, Text } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { Pagination as IPagination } from '../../services/apiFunctions/companies/products/types'
import { PaginationItem } from './PaginationItem'

interface PaginationProps {
  totalCountOfRegisters?: number
  registersPerPage?: number
  currentPage?: number
  onPageChange: (page: number) => void
}

const siblingsCount = 1

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1
    })
    .filter((page) => page > 0)
}

export function Pagination({
  currentPage = 1,
  onPageChange,
  registersPerPage = 10,
  totalCountOfRegisters,
}: PaginationProps) {
  const lastPage = Math.ceil(totalCountOfRegisters / registersPerPage)

  const previousPages =
    currentPage > 1 ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1) : []

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(currentPage, Math.min(currentPage + siblingsCount, lastPage))
      : []

  return (
    <Stack direction={['column', 'row']} mt="8" justify="space-between" align="center" spacing="6">
      <Box>
        <strong>{previousPages[0] ? previousPages[0] * registersPerPage : 0}</strong> -{' '}
        <strong>
          {nextPages[0] ? (nextPages[0] - 1) * registersPerPage : totalCountOfRegisters}
        </strong>{' '}
        de <strong>{totalCountOfRegisters}</strong>
      </Box>

      <Stack direction="row" spacing="2">
        {currentPage > 1 + siblingsCount && (
          <>
            <PaginationItem onPageChange={onPageChange} pageNumber={1} />
            {currentPage > 2 + siblingsCount && (
              <Text color="gray.300" width="8" textAlign="center">
                ...
              </Text>
            )}
          </>
        )}
        {previousPages.length > 0 &&
          previousPages.map((page) => {
            return <PaginationItem onPageChange={onPageChange} key={page} pageNumber={page} />
          })}
        <PaginationItem onPageChange={onPageChange} pageNumber={currentPage} isCurrent />
        {nextPages.length > 0 &&
          nextPages.map((page) => {
            return <PaginationItem onPageChange={onPageChange} key={page} pageNumber={page} />
          })}
        {currentPage + siblingsCount < lastPage && (
          <>
            {currentPage + 1 + siblingsCount < lastPage && (
              <Text color="gray.300" width="8" textAlign="center">
                ...
              </Text>
            )}
            <PaginationItem onPageChange={onPageChange} pageNumber={lastPage} />
          </>
        )}{' '}
      </Stack>
    </Stack>
  )
}

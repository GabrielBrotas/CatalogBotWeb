import { Flex, Tag } from '@chakra-ui/react'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

interface CompanyBenefitsTagProps {
  tags: string[]
  canRemove?: boolean
  handleRemoveBenefit?: (index: number) => void
  secondary?: boolean
}

export const CompanyBenefitsTag = ({
  tags,
  canRemove = false,
  handleRemoveBenefit,
  secondary = false,
}: CompanyBenefitsTagProps) => {
  return (
    <Flex flexWrap="wrap" w="100%" mt={6}>
      {tags.map((tag, index) => (
        <Tag
          key={index}
          mr={6}
          size="lg"
          variant="subtle"
          bg={secondary ? '#e2e2e2' : 'gray.50'}
          textColor="gray.600"
          borderRadius="full"
        >
          {tag}
          {canRemove && (
            <AiOutlineClose
              style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
              size={20}
              onClick={() => handleRemoveBenefit(index)}
            />
          )}
        </Tag>
      ))}
    </Flex>
  )
}

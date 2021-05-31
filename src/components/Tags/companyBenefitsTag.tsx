import { Flex, Tag } from '@chakra-ui/react';
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface CompanyBenefitsTagProps {
  tags: string[];
  canRemove?: boolean;
}

export const CompanyBenefitsTag = ({
  tags,
  canRemove = false,
}: CompanyBenefitsTagProps) => {
  return (
    <Flex flexWrap="wrap" w="100%" mt={6}>
      {tags.map((tag, index) => (
        <Tag key={index} size="lg" variant="subtle" borderRadius="full">
          {tag}
          {canRemove && (
            <AiOutlineClose
              style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
              size={20}
            />
          )}
        </Tag>
      ))}
    </Flex>
  );
};

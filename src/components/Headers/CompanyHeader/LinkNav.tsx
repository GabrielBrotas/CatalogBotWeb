import React from 'react'
import { Button, HStack, Icon } from '@chakra-ui/react'
import { AiOutlineCopy } from 'react-icons/ai'
import { useCompanyAuth } from '../../../contexts/AuthCompany'
import { APP_URL } from '../../../configs/constants'
import { useToast } from '../../../contexts/Modals/Toast'

export function LinkNav() {
  const { company } = useCompanyAuth()
  const { addToast } = useToast()

  const copyLink = async () => {
    try {
      if (!company) return
      await navigator.clipboard.writeText(`${APP_URL}/catalog/${company._id}`)
      addToast({ title: 'Link copiado com sucesso!', status: 'success' })
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err)
      addToast({ title: 'Erro ao copiar link!', status: 'success' })
    }
  }

  return (
    <HStack spacing={['6', '8']} py="1" color="gray.300">
      <Button
        bg="transparent"
        _hover={{ bg: 'transparent' }}
        _active={{ bg: 'transparent' }}
        spacing={['6', '8']}
        position="relative"
        onClick={copyLink}
      >
        <Icon as={AiOutlineCopy} fontSize="22" />
      </Button>
    </HStack>
  )
}

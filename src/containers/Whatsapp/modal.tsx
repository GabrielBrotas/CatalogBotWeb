import React from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Image,
} from '@chakra-ui/react'
import { useCompanyAuth } from '../../contexts/AuthCompany'
import { useEffect } from 'react'

export const WhatsAppModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { isSocketConnected, isWppConnected, wppConnIsLoading, connectWhatsapp, qrCode } =
    useCompanyAuth()

  const handleOpenModal = () => {
    onOpen()
    if (!isWppConnected && !wppConnIsLoading && isSocketConnected) {
      console.log('call func')
      connectWhatsapp()
    }
  }

  useEffect(() => {
    if (isWppConnected) {
      onClose()
    }
  }, [isWppConnected, onClose])
  return (
    <>
      {!isWppConnected && (
        <Button onClick={handleOpenModal} colorScheme="pink">
          Ler QRCode
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent background="gray.700">
          <ModalHeader>Qr Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody background="gray.700">
            {qrCode && (
              <Image src={`data:image/png;charset=utf-8;base64,${qrCode}`} alt="qr-code" />
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

import {
  AlertDialog as ChakraAlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import React from 'react'
import { useAlertModal } from '../../contexts/Modals/AlertModal'
import { Section } from '../Section'

export const AlertDialog = () => {
  const { isAlertModalOpen, handleCloseAlertModal, alertModalContent } = useAlertModal()

  const onClose = () => handleCloseAlertModal()
  const cancelRef = React.useRef()

  return (
    <Section>
      <ChakraAlertDialog
        isOpen={isAlertModalOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="gray.800">
              {alertModalContent?.title}
            </AlertDialogHeader>

            <AlertDialogBody color="gray.700">{alertModalContent?.description}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Voltar
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  alertModalContent?.onConfirm()
                  handleCloseAlertModal()
                }}
                ml={3}
              >
                {alertModalContent?.submitButtonText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </ChakraAlertDialog>
    </Section>
  )
}

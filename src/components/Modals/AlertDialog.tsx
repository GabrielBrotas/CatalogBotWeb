import React from 'react'
import {
  AlertDialog as ChakraAlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Input,
} from '@chakra-ui/react'
import { useAlertModal } from '../../contexts/Modals/AlertModal'

export const AlertDialog = () => {
  const { isAlertModalOpen, handleCloseAlertModal, alertModalContent } = useAlertModal()

  const [value, setValue] = React.useState<string>()

  const onClose = () => handleCloseAlertModal()
  const cancelRef = React.useRef()

  const handleSubmit = () => {
    alertModalContent?.onConfirm(value)
    handleCloseAlertModal()
    setValue(null)
  }

  return (
    <ChakraAlertDialog isOpen={isAlertModalOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold" color="gray.800">
            {alertModalContent?.title}
          </AlertDialogHeader>

          <AlertDialogBody color="gray.700">{alertModalContent?.description}</AlertDialogBody>

          {alertModalContent?.showInput && (
            <Box paddingX="6" marginY="2">
              <Input value={value} onChange={(e) => setValue(e.target.value)} color="gray.700" />
            </Box>
          )}

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Voltar
            </Button>

            <Button
              colorScheme={alertModalContent?.showInput ? 'blue' : 'red'}
              onClick={handleSubmit}
              ml={3}
            >
              {alertModalContent?.submitButtonText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </ChakraAlertDialog>
  )
}

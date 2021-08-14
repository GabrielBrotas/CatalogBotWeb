import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Box,
  Flex,
  Button,
} from '@chakra-ui/react'
import { generateDownload } from '../../utils/upload'

interface OnFinishCropProps {
  base64: string
  data: { width: number; height: number; x: number; y: number }
}

interface CropModalProps {
  src: string
  isOpen: boolean
  onClose: () => void
  onFinishCrop: ({ base64, data }: OnFinishCropProps) => void
}

export const CropModal = ({ src, isOpen, onClose, onFinishCrop }: CropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels)
  }, [])

  const onDownload = async () => {
    const base64 = await generateDownload({ imageSrc: src, crop: croppedArea })
    onFinishCrop({ base64, data: croppedArea })
    setZoom(1)
    setCrop({ x: 0, y: 0 })
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent height="40rem" w="full" backgroundColor="#fff">
          <ModalBody height="100%">
            {src && (
              <>
                <Box position="relative" w="full" height="80%">
                  <Cropper
                    image={src}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </Box>

                <Slider
                  aria-label="slider-ex-1"
                  mt="4"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(value) => setZoom(value)}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>

                <Flex w="full" align="center" justify="space-evenly" mt="4">
                  <Button bg="gray.400" onClick={onClose} w="8rem">
                    Cancelar
                  </Button>
                  <Button colorScheme="pink" w="8rem" onClick={onDownload}>
                    Adicionar
                  </Button>
                </Flex>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

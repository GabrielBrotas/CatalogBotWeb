import { Flex, Image, Box, useDisclosure, AspectRatio } from '@chakra-ui/react'
import React, { ReactNode, useCallback, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'

import Dropzone from 'react-dropzone'
import { BsTrash } from 'react-icons/bs'
import { CropModal } from './CropModal'

interface UploadProps {
  uploadedImages: UploadedImages[]
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImages[]>>
}

export type UploadedImages = {
  file?: string
  id: string
  name: string
  aspectRadio: number
  width?: number
  height?: number
  preview: string
  progress: number
  uploaded: boolean
  error: boolean
  url: string | null
}

interface OnFinishCropProps {
  base64: string
  data: { width: number; height: number; x: number; y: number }
}

const Upload: React.FC<UploadProps> = ({ setUploadedImages, uploadedImages }: UploadProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  function renderDragMessage(isDragActive: boolean, isDragRejest: boolean): ReactNode {
    if (!isDragActive) {
      return (
        <Flex justify="center" w="100%" padding="9" borderColor="gray.300">
          Selecione ou arraste a(s) imagem aqui.
        </Flex>
      )
    }

    if (isDragRejest) {
      return (
        <Flex justify="center" w="100%" padding="9" borderColor="red.400">
          Arquivo não suportado
        </Flex>
      )
    }

    return (
      <Flex justify="center" w="100%" padding="9" borderColor="green.400">
        Solte a imagem aqui
      </Flex>
    )
  }

  const [src, setSrc] = useState(null)
  const [extension, setExtension] = useState(null)

  // React crop ---
  const onSelectFile = (e: File[]) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => setSrc(reader.result))
    reader.readAsDataURL(e[0])
    setExtension(e[0].type.split('/')[1])
    onOpen()
  }

  const cancelCrop = () => {
    setSrc(null)
    onClose()
  }

  const onFinishCrop = ({ base64, data }: OnFinishCropProps) => {
    const newImage = {
      file: base64,
      id: uuidV4(),
      name: `${uuidV4()}.${extension}`,
      aspectRadio: 4 / 3,
      width: data.width,
      height: data.height,
      preview: base64,
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
    }

    setUploadedImages(uploadedImages.concat(newImage))
    onClose()
  }

  const handleRemoveImage = useCallback(
    (indexToRemove) => {
      setUploadedImages(uploadedImages.filter((_, index) => index !== indexToRemove))
    },
    [setUploadedImages, uploadedImages]
  )

  const borderColor = (isDragActive = false, isDragReject = false) => {
    if (isDragActive && !isDragReject) {
      return 'green.400'
    } else if (isDragReject) {
      return 'red.400'
    } else {
      return 'gray.300'
    }
  }

  return (
    <>
      {uploadedImages.length > 0 ? (
        uploadedImages.map((image, index) => (
          <Box position="relative" key={image.id}>
            <AspectRatio
              ratio={image.aspectRadio}
              key={image.id}
              w={image.width ? image.width : '20rem'}
              maxW="20rem"
            >
              <Image
                objectFit="cover"
                src={image.url ? image.url : image.preview}
                alt={image.url}
              />
            </AspectRatio>
            <Box
              bg="white"
              position="absolute"
              w="100%"
              h="100%"
              top="0"
              opacity="0.4"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <BsTrash
                size={28}
                color="#ff0404"
                style={{ cursor: 'pointer' }}
                onClick={() => handleRemoveImage(index)}
              />
            </Box>
          </Box>
        ))
      ) : (
        // <Dropzone accept="image/*" onDropAccepted={(files) => submitImages(files)} multiple={false}>
        <Dropzone accept="image/*" onDropAccepted={(files) => onSelectFile(files)} multiple={false}>
          {({ getRootProps, getInputProps, isDragActive, isDragReject }): any => (
            <Box
              cursor="pointer"
              outline="none"
              borderRadius="3xl"
              border="1px"
              borderStyle="dashed"
              w="full"
              h="full"
              borderColor={borderColor(isDragActive, isDragReject)}
              {...getRootProps()}
            >
              <input {...getInputProps()} className="outline-none" />
              {renderDragMessage(isDragActive, isDragReject)}
            </Box>
          )}
        </Dropzone>
      )}

      <CropModal src={src} isOpen={isOpen} onClose={cancelCrop} onFinishCrop={onFinishCrop} />
    </>
  )
}

export default Upload

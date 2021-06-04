import { Flex, Image, Box } from '@chakra-ui/react'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'

import Dropzone from 'react-dropzone'
import { BsTrash } from 'react-icons/bs'
// import { uploadPublicFile } from '../../services/apiFunctions/uploads'

interface UploadProps {
  uploadedImages: UploadedImages[]
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImages[]>>
}

export type UploadedImages = {
  file?: File
  id: string
  name: string | null
  size: number | null
  preview: string | null
  progress: number
  uploaded: boolean
  error: boolean
  url: string | undefined | null
}

const Upload: React.FC<UploadProps> = ({ setUploadedImages, uploadedImages }: UploadProps) => {
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
  console.log(uploadedImages)
  // const [newImages, setNewImages] = useState<Array<UploadedImages>>([])
  // const [changeProgress, setChangeProgress] = useState<[number, string] | []>([])
  // const [uploadFinish, setUploadFinish] = useState<[string, string, boolean] | []>([])

  function submitImages(files: File[]): void {
    const newUploadedImages = files.map((file) => ({
      file,
      id: `${new Date().getTime()}-${file.name}`,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
    }))

    setUploadedImages(uploadedImages.concat(newUploadedImages))
    // setNewImages([...newUploadedImages])
  }

  // useEffect(() => {
  //   newImages.forEach((file) => {
  //     if (!file.file) return
  //     // uploadPublicFile({ file: file.file, id: file.id, setChangeProgress })
  //     //   .then((response) => {
  //     //     setUploadFinish([file.id, response.url, true])
  //     //     setNewImages([])
  //     //   })
  //     //   .catch((err) => {
  //     //     alert(err)
  //     //     if (!file.preview) return
  //     //     setUploadFinish([file.id, file.preview, false])
  //     //     setNewImages([])
  //     //   })
  //   })
  // }, [newImages])

  // useEffect(() => {
  //   const id = changeProgress[1]
  //   const progress = changeProgress[0]

  //   if (!progress) return

  //   if (progress !== 100) {
  //     setUploadedImages(
  //       uploadedImages.map((file) => {
  //         return file.id === id ? { ...file, progress } : { ...file }
  //       })
  //     )
  //   }
  //   // eslint-disable-next-line
  // }, [changeProgress])

  // useEffect(() => {
  //   const uploadedFileId = uploadFinish[0]
  //   const url = uploadFinish[1]
  //   const uploadSuccess = uploadFinish[2]

  //   if (uploadSuccess) {
  //     setUploadedImages(
  //       uploadedImages.map((file) => {
  //         return file.id === uploadedFileId ? { ...file, url, uploaded: true } : { ...file }
  //       })
  //     )
  //   } else {
  //     setUploadedImages(
  //       uploadedImages.map((file) => {
  //         return file.id === uploadedFileId ? { ...file, error: true } : { ...file }
  //       })
  //     )
  //   }

  //   // eslint-disable-next-line
  // }, [uploadFinish])

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
            <Image
              boxSize="200px"
              objectFit="cover"
              src={image.url ? image.url : image.preview}
              alt={image.url}
            />
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
        <Dropzone accept="image/*" onDropAccepted={(files) => submitImages(files)} multiple={false}>
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
    </>
  )
}

export default Upload

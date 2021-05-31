import { Box } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/react';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import Dropzone from 'react-dropzone';
import { uploadPublicFile } from '../../services/apiFunctions/uploads';

interface UploadProps {
  uploadedImages: UploadedImages[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImages[]>>;
}

export type UploadedImages = {
  file?: File;
  id: string;
  name: string | null;
  size: number | null;
  preview: string | null;
  progress: number;
  uploaded: boolean;
  error: boolean;
  url: string | undefined | null;
};

const Upload: React.FC<UploadProps> = ({
  setUploadedImages,
  uploadedImages,
}: UploadProps) => {
  function renderDragMessage(
    isDragActive: boolean,
    isDragRejest: boolean,
  ): ReactNode {
    if (!isDragActive) {
      return (
        <Flex justify="center" w="100%" padding="9" borderColor="gray.300">
          Selecione ou arraste a(s) imagem aqui.
        </Flex>
      );
    }

    if (isDragRejest) {
      return (
        <Flex justify="center" w="100%" padding="9" borderColor="red.400">
          Arquivo não suportado
        </Flex>
      );
    }

    return (
      <Flex justify="center" w="100%" padding="9" borderColor="green.400">
        Solte a imagem aqui
      </Flex>
    );
  }

  const [newImages, setNewImages] = useState<Array<UploadedImages>>([]);
  const [changeProgress, setChangeProgress] = useState<[number, string] | []>(
    [],
  );
  const [uploadFinish, setUploadFinish] = useState<
    [string, string, boolean] | []
  >([]);

  function submitImages(files: File[]): void {
    const newUploadedImages = files.map(file => ({
      file,
      id: `${new Date().getTime()}-${file.name}`,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
    }));

    setUploadedImages(uploadedImages.concat(newUploadedImages));
    setNewImages([...newUploadedImages]);
  }

  useEffect(() => {
    newImages.forEach(file => {
      if (!file.file) return;
      uploadPublicFile({ file: file.file, id: file.id, setChangeProgress })
        .then(response => {
          setUploadFinish([file.id, response.url, true]);
          setNewImages([]);
        })
        .catch(err => {
          alert(err);
          if (!file.preview) return;
          setUploadFinish([file.id, file.preview, false]);
          setNewImages([]);
        });
    });
  }, [newImages]);

  useEffect(() => {
    const id = changeProgress[1];
    const progress = changeProgress[0];

    if (!progress) return;

    if (progress !== 100) {
      setUploadedImages(
        uploadedImages.map(file => {
          return file.id === id ? { ...file, progress } : { ...file };
        }),
      );
    }
    // eslint-disable-next-line
  }, [changeProgress]);

  useEffect(() => {
    const uploadedFileId = uploadFinish[0];
    const url = uploadFinish[1];
    const uploadSuccess = uploadFinish[2];

    if (uploadSuccess) {
      setUploadedImages(
        uploadedImages.map(file => {
          return file.id === uploadedFileId
            ? { ...file, url, uploaded: true }
            : { ...file };
        }),
      );
    } else {
      setUploadedImages(
        uploadedImages.map(file => {
          return file.id === uploadedFileId
            ? { ...file, error: true }
            : { ...file };
        }),
      );
    }

    // eslint-disable-next-line
  }, [uploadFinish]);

  const borderColor = (isDragActive = false, isDragReject = false) => {
    if (isDragActive && !isDragReject) {
      return 'green.400';
    } else if (isDragReject) {
      return 'red.400';
    } else {
      return 'gray.300';
    }
  };

  return (
    <>
      <Dropzone
        accept="image/*"
        onDropAccepted={files => submitImages(files)}
        multiple={true}
      >
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
            // className={`cursor-pointer outline-none border-2 border-dashed rounded-xl border-gray-400 ${
            //   isDragActive && !isDragReject && 'border-green-600 text-green-600'
            // } ${isDragReject && 'border-red-600 text-red-600'}`}
            {...getRootProps()}
          >
            <input {...getInputProps()} className="outline-none" />
            {renderDragMessage(isDragActive, isDragReject)}
          </Box>
        )}
      </Dropzone>
    </>
  );
};

export default Upload;

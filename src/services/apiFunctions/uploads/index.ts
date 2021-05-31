import api from '../../api';

export interface IUploadFile {
  file: File;
  id?: string;
  setChangeProgress?: React.Dispatch<React.SetStateAction<any>>;
}

export interface IUploadedFile {
  url: string;
  mimetype: string;
}
export const uploadPublicFile = async ({
  file,
  id,
  setChangeProgress,
}: IUploadFile): Promise<IUploadedFile> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData: any = new FormData();
  formData.append('file', file);

  return await api
    .post('/uploads/public', formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
      onUploadProgress: e => {
        const progress = Number(Math.round((e.loaded * 100) / e.total));
        if (setChangeProgress && id) {
          setChangeProgress([progress, id]);
        }
      },
    })
    .then(({ data }) => data);
};

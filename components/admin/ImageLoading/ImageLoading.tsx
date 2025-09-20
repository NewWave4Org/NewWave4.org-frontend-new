'use client';

import { useCallback, useState } from 'react';
import {useDropzone} from 'react-dropzone'
import useImageLoading from './hook/useImageLoading';
import Image from 'next/image';
import { ArticleType } from '@/utils/ArticleType';

interface IImageLoading {
  contentType: ArticleType;
  articleId: number;
  uploadedUrls?: string[];
  onFilesChange?: (urls: string[]) => void;
  classBlock?: string;
  label?: string;
  maxFiles?: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function ImageLoading({ classBlock='', label='', maxFiles=1, contentType, articleId, uploadedUrls=[], onFilesChange }: IImageLoading) {
  const { uploadFiles, deleteFile } = useImageLoading({contentType, articleId});

  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (files: File[]) => {
    setLoading(true);
    try {
      const newUrls = await uploadFiles(files);
      const updated = [...uploadedUrls, ...newUrls];

      onFilesChange?.(updated);
    } finally {
      setLoading(false);
    }
  }, [uploadFiles, onFilesChange, uploadedUrls]);

  const handleDelete = useCallback(async (url: string) => {
    await deleteFile(url);
    const updated = uploadedUrls.filter(u => u !== url);
    onFilesChange?.(updated);
  }, [deleteFile, uploadedUrls, onFilesChange]);
  
  const {getRootProps, getInputProps, isDragActive, fileRejections} = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.webp', '.jpg']
    },
    maxFiles: maxFiles,
    maxSize: MAX_FILE_SIZE,
  })

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <div key={file.name} className="text-red-600">
      {errors.map((e) => {
        if (e.code === "file-too-large") {
          return <p key={e.code}>{file.name} is too large. Max size is 10Mb.</p>;
        }
        if (e.code === "file-invalid-type") {
          return <p key={e.code}>{file.name} has invalid file type.</p>;
        }
        return <p key={e.code}>{e.message}</p>;
      })}
    </div>
  ));

  const showDropzone = uploadedUrls.length === 0 || (uploadedUrls.length < maxFiles && maxFiles > 1);

  return (
    <div className='flex flex-col h-full'>
      {label && <div className='block text-medium2 mb-1 text-admin-700 '>{label}</div>}

      {loading && <div className="mb-2 text-sm text-blue-600">Uploading...</div>}

      {showDropzone && (
        <div {...getRootProps()} className={`${isDragActive ? 'border-green-400' : 'border-stone-400'} ${classBlock} w-full bg-slate-50 flex flex-col items-center 
        justify-center rounded-md border-2 border-dashed  cursor-pointer hover:border-amber-500 flex-1`}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <>
                <p>Drag 'n' drop some files here, or click to select files</p>
                <em>(Only *.jpeg, *.png, *.webp, *.jpg and 10Mb images will be accepted)</em>
              </>
          }
        </div>
      )}

      {fileRejectionItems}

      {uploadedUrls.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {uploadedUrls.map((url, i) => (
            <div key={i} className="relative w-24 h-24">
              <Image src={url} alt={`uploaded-${i}`} width={200} height={200} />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
                onClick={() => handleDelete(url)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageLoading;

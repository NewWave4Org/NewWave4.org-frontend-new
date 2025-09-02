import React, { useState } from 'react';
import { useField, useFormikContext } from 'formik';
import { toast } from 'react-toastify';
import Button from '../shared/Button';
import Image from 'next/image';

interface PhotoUploaderProps {
  name: string;
  label: string;
  maxFiles: number;
  multiple?: boolean;
  onUpload: (files: File[]) => Promise<string[]>;
  onDelete?: (url: string) => Promise<void>;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  name,
  label,
  maxFiles,
  multiple = false,
  onUpload,
  onDelete,
}) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field] = useField<string | string[]>(name);
  const [loading, setLoading] = useState(false);

  const values: string[] = Array.isArray(field.value)
    ? field.value
    : field.value
    ? [field.value]
    : [];

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length + values.length > maxFiles) {
      toast.error(`You can upload a maximum of ${maxFiles} files`);
      return;
    }

    setLoading(true);
    try {
      const uploadedUrls = await onUpload(selectedFiles);

      if (maxFiles === 1) {
        setFieldValue(name, uploadedUrls[0]);
      } else {
        setFieldValue(name, [...values, ...uploadedUrls].slice(0, maxFiles));
      }
    } catch {
      toast.error('Failed to upload files');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (url: string) => {
    try {
      if (onDelete) {
        await onDelete(url);
      }

      if (maxFiles === 1) {
        setFieldValue(name, '');
      } else {
        setFieldValue(
          name,
          values.filter((v: string) => v !== url),
        );
      }
    } catch {
      toast.error('Failed to delete file');
    }
  };

  return (
    <div className="mb-4">
      <label className="text-admin-700 mb-3">{label}</label>

      {loading && <p>Loading...</p>}
      <div className="flex gap-2 mt-2 mb-2 flex-wrap">
        {values.map((url, index) => (
          <div key={`${url}-${index}`} className="relative">
            <Image
              src={url}
              alt="preview"
              height={200}
              width={300}
              className="object-cover rounded"
            />
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

      <div className="relative inline-block">
        <input
          type="file"
          accept="image/*"
          multiple={multiple || maxFiles > 1}
          onChange={handleUpload}
          disabled={loading || values.length >= maxFiles}
          className="absolute w-full h-full opacity-0"
        />
        <Button
          size="medium"
          className="!bg-blue-600 text-white !rounded-[5px] "
        >
          {values.length > 0 ? 'Change photo' : 'Select file'}
        </Button>
      </div>
    </div>
  );
};

export default PhotoUploader;

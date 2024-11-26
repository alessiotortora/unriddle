'use client';

import { useCallback, useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { uploadToCloudinary } from '@/lib/actions/cloudinary';
import { createImage } from '@/lib/actions/create/create-image';
import { uploadToMux } from '@/lib/actions/mux';

import { Button } from './button';
import FileThumbnail from './file-thumbnail';

export interface FileWithPreview extends File {
  preview: string;
}

interface SonnerProps {
  message: string;
}

interface FileUploaderProps {
  onUploadComplete?: (
    items: {
      type: 'url' | 'playbackId';
      value: string | null;
      identifier?: string;
    }[],
  ) => void;
}

function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const router = useRouter();
  const params = useParams();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    setSuccess(null);
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    maxFiles: 5,
    multiple: true,
    onDropRejected: () =>
      setError('File rejected. Please ensure the file is an image or video.'),
  });

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const handleRemoveFile = (fileToRemove: FileWithPreview) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const handleUpload = async (files: File[]) => {
    setLoading(true);
    const uploadedItems: {
      type: 'url' | 'playbackId';
      value: string | null;
      identifier?: string;
    }[] = [];

    if (!params?.spaceId) {
      setError('User not found. Please try again.');
      setLoading(false);
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    const videoFiles = files.filter((file) => file.type.startsWith('video/'));

    const uploadPromise: Promise<SonnerProps> = new Promise(
      async (resolve, reject) => {
        try {
          if (imageFiles.length > 0) {
            const results = await uploadToCloudinary(imageFiles);

            const imagesToSave = results.map((result) => ({
              url: result.secure_url,
              publicId: result.public_id,
            }));

            await createImage(imagesToSave, params.spaceId as string);
            uploadedItems.push(
              ...results.map((r) => ({
                type: 'url' as const,
                value: r.secure_url,
              })),
            );
          }

          if (videoFiles.length > 0) {
            if (!videoFiles)
              throw new Error('No video files provided for upload');

            const results = await uploadToMux(
              videoFiles,
              params.spaceId as string,
            );
            uploadedItems.push(
              ...results.map((r) => ({
                type: 'playbackId' as const,
                value: null,
                identifier: r.identifier,
              })),
            );
          }

          onUploadComplete?.(uploadedItems);
          resolve({ message: 'Upload successful!' });
        } catch (error) {
          reject(error);
        } finally {
          setLoading(false);
        }
      },
    );
    toast.promise(uploadPromise, {
      loading: 'Uploading...',
      success: (data: SonnerProps) => {
        router.refresh();
        return `${data.message}`;
      },
      error: 'Failed to upload files. Please try again.',
    });

    setFiles([]);
  };

  return (
    <div className="flex min-h-full flex-col items-end">
      <div className="flex h-36 w-full cursor-pointer items-center justify-center border border-dashed p-20 outline-none">
        <div {...getRootProps()} className="text-center">
          <input {...getInputProps()} />
          {isDragActive ? (
            <div>
              <Upload size={36} />
              <p className="dropzone">Drop your image/video files here...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload size={36} strokeWidth={1.5} />
              <p className="dropzone">
                Drag & drop images/videos here or click to select files (max 5)
              </p>
            </div>
          )}
        </div>
      </div>

      {error && <p className="mt-2 text-red-600">{error}</p>}
      {success && <p className="mt-2 text-green-600">{success}</p>}

      {files.length > 0 && (
        <Button
          variant="default"
          className="mt-4"
          onClick={() => handleUpload(files)}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      )}

      <aside className="mt-4 flex w-full flex-wrap justify-center">
        <FileThumbnail files={files} onRemove={handleRemoveFile} />
      </aside>
    </div>
  );
}

export default FileUploader;

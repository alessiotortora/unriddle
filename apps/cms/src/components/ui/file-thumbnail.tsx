import Image from 'next/image';

import { Button } from './button';
import { FileWithPreview } from './file-uploader';
import Icon from './icon';

interface FileThumbnailProps {
  files: FileWithPreview[];
  onRemove: (file: FileWithPreview) => void;
}

export default function FileThumbnail({ files, onRemove }: FileThumbnailProps) {
  return (
    <>
      {files.map((file) => {
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        const isVideo = file.type.startsWith('video/');

        return (
          <div
            key={file.name}
            className="flex w-full items-center justify-between p-2"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                {isVideo ? (
                  <div className="bg-muted flex h-full w-full items-center justify-center rounded-lg">
                    <Icon
                      name="fileVideo"
                      size={24}
                      className="text-foreground/70"
                    />
                  </div>
                ) : (
                  <Image
                    src={file.preview}
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview);
                    }}
                    fill
                    loading="lazy"
                    alt={file.name}
                    className="aspect-square shrink-0 rounded-lg object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-foreground/80 text-sm font-medium">
                  {file.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {fileSizeInMB}&nbsp;MB
                </p>
              </div>
            </div>

            <Button
              onClick={() => onRemove(file)}
              size="icon"
              className="border-input bg-background hover:bg-accent hover:text-accent-foreground h-6 w-6 border shadow-sm"
            >
              <Icon name="x" size={18} className="text-foreground" />
            </Button>
          </div>
        );
      })}
    </>
  );
}

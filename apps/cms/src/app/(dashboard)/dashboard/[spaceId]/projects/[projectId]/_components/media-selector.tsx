'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import FileUploader from '@/components/ui/file-uploader';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as Images, Video } from '@/db/schema';
import { useRealtime } from '@/hooks/use-realtime';

interface MediaSelectorProps {
  id?: string; // Add this prop
  images: Images[];
  videos: Video[];
  value: {
    type: 'url' | 'playbackId';
    value: string | null;
    identifier?: string;
  }[];
  onChange: (
    mediaItems: {
      id?: string;
      type: 'url' | 'playbackId';
      value: string | null;
      identifier?: string;
    }[],
  ) => void;
  maxSelection?: number;
  title: string;
  side: 'top' | 'right' | 'bottom' | 'left';
}

const LoadingSpinner = () => (
  <div className="flex h-16 w-32 items-center justify-center rounded-md bg-gray-100">
    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
  </div>
);

export const MediaSelector = ({
  id = 'default',
  images,
  videos,
  value,
  onChange,
  maxSelection = 8,
  title,
  side,
}: MediaSelectorProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleVideoUpdate = useCallback(
    (payload: any) => {
      const updatedVideo = payload.new;

      if (updatedVideo.playback_id) {
        const updatedValue = valueRef.current.map((item) => {
          if (item.identifier === updatedVideo.identifier) {
            return {
              type: 'playbackId' as const, // Explicit type enforcement
              value: updatedVideo.playback_id,
              identifier: updatedVideo.identifier,
            };
          }
          return item;
        });

        // Check for changes
        const hasChanges = updatedValue.some(
          (item, index) => item !== valueRef.current[index],
        );

        if (hasChanges) {
          onChange(updatedValue);
        }
      }
    },
    [onChange],
  );

  useRealtime(`videos-${id}`, handleVideoUpdate);

  const toggleMediaItem = useCallback(
    (mediaItem: {
      type: 'url' | 'playbackId';
      id: string;
      value: string;
      identifier?: string;
    }) => {
      console.log(mediaItem);
      const exists = value.some(
        (item) =>
          item.type === mediaItem.type && item.value === mediaItem.value,
      );

      let newMediaItems;

      if (exists) {
        newMediaItems = value.filter(
          (item) =>
            !(item.type === mediaItem.type && item.value === mediaItem.value),
        );
      } else {
        if (maxSelection && value.length >= maxSelection) {
          if (maxSelection === 1) {
            newMediaItems = [mediaItem];
          } else {
            return;
          }
        } else {
          newMediaItems = [...value, mediaItem];
        }
      }

      onChange(newMediaItems);
    },
    [value, maxSelection, onChange],
  );

  const handleUploadComplete = (
    items: {
      type: 'url' | 'playbackId';
      value: string | null;
      identifier?: string;
    }[],
  ) => {
    if (maxSelection === 1) {
      onChange(items);
    } else {
      const newItems = [...(value || [])];

      items.forEach((item) => {
        const exists = newItems.some((existing) => {
          const isDuplicate =
            existing.identifier !== undefined && item.identifier !== undefined
              ? existing.identifier === item.identifier
              : existing.type === item.type && existing.value === item.value;

          return isDuplicate;
        });

        if (!exists) {
          newItems.push(item);
        }
      });

      onChange(newItems.slice(0, maxSelection));
    }

    // Close the popover after successful upload
    setIsPopoverOpen(false);
  };

  return (
    <div>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger
          asChild
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        >
          <Button variant="secondary">
            {title} {maxSelection > 1 && `${value.length}/${maxSelection}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent side={side} className="p-4">
          <Tabs defaultValue="images">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
            </TabsList>
            <TabsContent value="images">
              <ScrollArea className="h-[400px]">
                <div className="flex flex-wrap gap-2">
                  {images.map((image) => (
                    <Suspense key={image.id} fallback={<LoadingSpinner />}>
                      <MediaThumbnail
                        id={image.id}
                        type="url"
                        itemValue={image.url}
                        thumbnailUrl={image.url}
                        isSelected={value.some(
                          (item) =>
                            item.type === 'url' && item.value === image.url,
                        )}
                        onToggle={toggleMediaItem}
                      />
                    </Suspense>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="videos">
              <ScrollArea className="h-[400px]">
                <div className="flex flex-wrap gap-2">
                  {videos.map((video) => (
                    <Suspense key={video.id} fallback={<LoadingSpinner />}>
                      <MediaThumbnail
                        id={video.id}
                        type="playbackId"
                        itemValue={video.playbackId || ''}
                        thumbnailUrl={
                          video.playbackId
                            ? `https://image.mux.com/${video.playbackId}/thumbnail.webp`
                            : ''
                        }
                        isSelected={value.some(
                          (item) =>
                            item.type === 'playbackId' &&
                            item.value === video.playbackId,
                        )}
                        onToggle={toggleMediaItem}
                        isPending={!video.playbackId}
                      />
                    </Suspense>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="upload">
              <FileUploader
                onUploadComplete={handleUploadComplete}
                maxFiles={Math.min(maxSelection || 5, 5)}
              />
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
      {maxSelection > 1 && value.length > 0 && (
        <div className="mt-4">
          <p>Selected Media Items:</p>
          <div className="flex flex-wrap gap-2">
            {value.map((item, index) => (
              <Suspense key={index} fallback={<LoadingSpinner />}>
                {!item.value || (item.type === 'playbackId' && !item.value) ? (
                  <LoadingSpinner />
                ) : (
                  <div className="relative h-16 w-32">
                    <Image
                      src={
                        item.type === 'url'
                          ? item.value
                          : `https://image.mux.com/${item.value}/thumbnail.webp`
                      }
                      fill
                      sizes="(max-width: 768px) 128px, 128px"
                      alt={
                        item.type === 'url'
                          ? 'Selected Image'
                          : 'Selected Video'
                      }
                      className="rounded-md"
                    />
                  </div>
                )}
              </Suspense>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for thumbnails
const MediaThumbnail = ({
  id,
  type,
  itemValue,
  thumbnailUrl,
  isSelected,
  onToggle,
  isPending,
}: {
  id: string;
  type: 'url' | 'playbackId';
  itemValue: string;
  thumbnailUrl: string;
  isSelected: boolean;
  onToggle: (item: {
    type: 'url' | 'playbackId';
    value: string;
    id: string;
  }) => void;
  isPending?: boolean;
}) => {
  if (isPending || !thumbnailUrl) {
    return <LoadingSpinner />;
  }

  return (
    <div
      onClick={() => onToggle({ type, value: itemValue, id: id })}
      className={`relative h-16 w-32 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <Image
        src={thumbnailUrl}
        fill
        sizes="(max-width: 768px) 128px, 128px"
        alt="thumbnail"
        className="rounded-md"
      />
    </div>
  );
};

'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { Check, ImageIcon, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as Images, Video } from '@/db/schema';
import { useRealtime } from '@/hooks/use-realtime';
import { cn } from '@/lib/utils';

import { useSidebar } from '../ui/sidebar';
import FileUploader from './file-uploader';

interface MediaSelectorProps {
  id?: string;
  images?: Images[];
  videos?: Video[];
  value: {
    id?: string;
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
    }[]
  ) => void;
  maxSelection?: number;
  title: string;
  side: 'top' | 'right' | 'bottom' | 'left';
  variant?: 'ghost' | 'secondary';
  imagesOnly?: boolean;
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
  variant = 'secondary',
  imagesOnly = false,
}: MediaSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('images');
  const hasSelection = value.length > 0;
  const { isMobile } = useSidebar();

  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleVideoUpdate = useCallback(
    (payload: { new: { playback_id: string | null; identifier: string } }) => {
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
        const hasChanges = updatedValue.some((item, index) => item !== valueRef.current[index]);

        if (hasChanges) {
          onChange(updatedValue);
        }
      }
    },
    [onChange]
  );

  useRealtime(`videos-${id}`, handleVideoUpdate);

  const toggleMediaItem = useCallback(
    (mediaItem: {
      type: 'url' | 'playbackId';
      id: string;
      value: string;
      identifier?: string;
    }) => {
      if (mediaItem.type === 'url') {
        setActiveTab('images');
      } else if (mediaItem.type === 'playbackId') {
        setActiveTab('videos');
      }

      const exists = value.some(
        (item) => item.type === mediaItem.type && item.value === mediaItem.value
      );

      let newMediaItems: typeof value;

      if (exists) {
        newMediaItems = value.filter(
          (item) => !(item.type === mediaItem.type && item.value === mediaItem.value)
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

      if (maxSelection === 1 && newMediaItems.length === 1) {
        setIsOpen(false);
      }

      onChange(newMediaItems);
    },
    [value, maxSelection, onChange]
  );

  const handleUploadComplete = (
    items: {
      id?: string;
      type: 'url' | 'playbackId';
      value: string | null;
      identifier?: string;
    }[]
  ) => {
    if (maxSelection === 1) {
      onChange(items);
    } else {
      const newItems = [...(value || [])];

      for (const item of items) {
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
      }

      onChange(newItems.slice(0, maxSelection));
    }

    setIsOpen(false);
  };

  const MediaContent = () => (
    <Tabs defaultValue="images" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className={cn('grid w-full', imagesOnly ? 'grid-cols-2' : 'grid-cols-3')}>
        <TabsTrigger value="images">Images</TabsTrigger>
        {!imagesOnly && <TabsTrigger value="videos">Videos</TabsTrigger>}
        <TabsTrigger value="upload">Upload New</TabsTrigger>
      </TabsList>
      <TabsContent value="images">
        <ScrollArea className={cn('h-[300px]', isMobile && 'h-[60vh]')}>
          <div className="mx-auto mt-5 flex flex-wrap justify-center gap-1 p-1 sm:gap-2 sm:p-0">
            {images?.map((image) => (
              <Suspense key={image.id} fallback={<LoadingSpinner />}>
                <MediaThumbnail
                  id={image.id}
                  type="url"
                  itemValue={image.url}
                  thumbnailUrl={image.url}
                  isSelected={value.some((item) => item.type === 'url' && item.value === image.url)}
                  onToggle={toggleMediaItem}
                />
              </Suspense>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      {!imagesOnly && (
        <TabsContent value="videos">
          <ScrollArea className={cn('h-[300px]', isMobile && 'h-[60vh]')}>
            <div className="mx-auto mt-5 flex flex-wrap justify-center gap-1 p-1 sm:gap-2 sm:p-0">
              {videos?.map((video) => {
                console.log(videos.length);
                return (
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
                        (item) => item.type === 'playbackId' && item.value === video.playbackId
                      )}
                      onToggle={toggleMediaItem}
                      isPending={!video.playbackId}
                    />
                  </Suspense>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      )}
      <TabsContent value="upload">
        <div className={cn('mt-5 h-[300px]', isMobile && 'mt-5 h-[60vh]')}>
          <FileUploader
            onUploadComplete={handleUploadComplete}
            maxFiles={Math.min(maxSelection || 5, 5)}
            imagesOnly={imagesOnly}
          />
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <div>
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button
              variant={variant}
              size="sm"
              className={cn('gap-1', variant === 'ghost' ? 'text-muted-foreground' : '')}
            >
              {!hasSelection && <ImageIcon />}
              {title} {maxSelection > 1 && `${value.length}/${maxSelection}`}
            </Button>
          </DrawerTrigger>
          <DrawerTitle className="sr-only" />
          <DrawerDescription className="sr-only" />
          <DrawerContent>
            <div className="mx-auto p-4">
              <MediaContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={variant}
              size="sm"
              className={cn('gap-1', variant === 'ghost' ? 'text-muted-foreground' : '')}
            >
              {!hasSelection && <ImageIcon />}
              {title} {maxSelection > 1 && `${value.length}/${maxSelection}`}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side} className="w-screen max-w-3xl p-4 md:w-[80vw]" align="center">
            <div className="w-full">
              <MediaContent />
            </div>
          </PopoverContent>
        </Popover>
      )}

      {maxSelection > 1 && value.length > 0 && (
        <div className="mt-4">
          <p>Selected Media Items:</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {value.map((item) => (
              <Suspense key={`${item.type}-${item.id || item.value}`} fallback={<LoadingSpinner />}>
                {!item.value || (item.type === 'playbackId' && !item.value) ? (
                  <LoadingSpinner />
                ) : (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={
                        item.type === 'url'
                          ? item.value
                          : `https://image.mux.com/${item.value}/thumbnail.webp`
                      }
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      alt={item.type === 'url' ? 'Selected Image' : 'Selected Video'}
                      className="rounded-md object-cover"
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
    id: string;
    type: 'url' | 'playbackId';
    value: string;
  }) => void;
  isPending?: boolean;
}) => {
  if (isPending || !thumbnailUrl) {
    return <LoadingSpinner />;
  }

  return (
    <div
      onClick={() => onToggle({ type, value: itemValue, id: id })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onToggle({ type, value: itemValue, id: id });
        }
      }}
      tabIndex={0}
      role="button"
      className={cn(
        'group relative aspect-video cursor-pointer overflow-hidden rounded-md',
        'w-[calc(50%-0.5rem)] min-w-[100px] max-w-[200px]',
        'sm:w-[calc(33%-0.5rem)]',
        'md:w-[calc(25%-0.5rem)]'
      )}
    >
      <Image
        src={thumbnailUrl}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        alt="thumbnail"
        className={cn('object-cover', isSelected && 'brightness-95')}
      />
      <div
        className={cn(
          'absolute inset-0 bg-black/10 transition-opacity',
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      />
      <div
        className={cn(
          'bg-primary absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-transform',
          isSelected ? 'scale-100' : 'scale-0 group-hover:scale-100'
        )}
      >
        <Check className="text-primary-foreground h-3.5 w-3.5" />
      </div>
    </div>
  );
};

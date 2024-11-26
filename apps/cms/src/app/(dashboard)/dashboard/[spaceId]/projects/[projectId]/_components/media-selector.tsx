'use client';

import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';

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
import { createClient } from '@/utils/supabase/client';

interface MediaSelectorProps {
  images: Images[];
  videos: Video[];
  value: {
    type: 'url' | 'playbackId';
    value: string | null;
    identifier?: string;
  }[];
  onChange: (
    mediaItems: {
      type: 'url' | 'playbackId';
      value: string | null;
      identifier?: string;
    }[],
  ) => void;
  maxSelection?: number;
  title: string;
  side: 'top' | 'right' | 'bottom' | 'left';
}

export const MediaSelector = ({
  images,
  videos,
  value,
  onChange,
  maxSelection = 8,
  title,
  side,
}: MediaSelectorProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [processingVideos, setProcessingVideos] = useState<string[]>([]);
  const supabase = createClient();

  console.log('value in media selector', value);

  // Filter valid videos
  const validVideos = videos.filter(
    (video): video is Video & { playbackId: string } =>
      video.playbackId !== null,
  );

  // Memoize toggleMediaItem
  const toggleMediaItem = useCallback(
    (mediaItem: {
      type: 'url' | 'playbackId';
      value: string;
      identifier?: string;
    }) => {
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
    console.log('items', items);

    // Extract identifiers of videos that are still processing
    const newProcessingVideos = items
      .filter(
        (item) =>
          item.type === 'playbackId' && item.value === null && item.identifier,
      )
      .map((item) => item.identifier!); // `!` safe due to the filter above

    // Add only unique identifiers to processingVideos
    if (newProcessingVideos.length > 0) {
      setProcessingVideos((prev) =>
        Array.from(new Set([...prev, ...newProcessingVideos])),
      );
    }

    // Update the media state with the new items
    if (maxSelection === 1) {
      onChange(items);
    } else {
      onChange([...value, ...items].slice(0, maxSelection));
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('videos')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'videos' },
        (payload) => {
          const updatedVideo = payload.new;
          console.log(payload);

          console.log('updated', updatedVideo);

          if (updatedVideo.playback_id) {
            console.log('test');
            // Remove the processed video from processingVideos
            setProcessingVideos((prev) => {
              const newProcessingVideos = prev.filter(
                (id) => id !== updatedVideo.identifier,
              );
              return newProcessingVideos;
            });

            console.log(value);

            // Find and update the corresponding item in value array
            const existingItem = value.find(
              (item) => item.identifier === updatedVideo.identifier,
            );

            if (existingItem) {
              console.log('item found', existingItem);
              console.log('test2');
              toggleMediaItem({
                type: 'playbackId',
                value: updatedVideo.playback_id!,
                identifier: updatedVideo.identifier!,
              });
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, toggleMediaItem, value]);

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
                    <MediaThumbnail
                      key={image.id}
                      type="url"
                      itemValue={image.url}
                      thumbnailUrl={image.url}
                      isSelected={value.some(
                        (item) =>
                          item.type === 'url' && item.value === image.url,
                      )}
                      onToggle={toggleMediaItem}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="videos">
              <ScrollArea className="h-[400px]">
                <div className="flex flex-wrap gap-2">
                  {validVideos.map((video) => (
                    <MediaThumbnail
                      key={video.id}
                      type="playbackId"
                      itemValue={video.playbackId}
                      thumbnailUrl={`https://image.mux.com/${video.playbackId}/thumbnail.webp`}
                      isSelected={value.some(
                        (item) =>
                          item.type === 'playbackId' &&
                          item.value === video.playbackId,
                      )}
                      onToggle={toggleMediaItem}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="upload">
              <FileUploader onUploadComplete={handleUploadComplete} />
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
      {maxSelection > 1 && value.length > 0 && (
        <div className="mt-4">
          <p>Selected Media Items:</p>
          <div className="flex flex-wrap gap-2">
            {value.map((item, index) => (
              <div key={index} className="relative h-16 w-32">
                <Image
                  src={
                    item.type === 'url'
                      ? item.value || ''
                      : `https://image.mux.com/${item.value}/thumbnail.webp`
                  }
                  fill
                  sizes="(max-width: 768px) 128px, 128px"
                  alt={
                    item.type === 'url' ? 'Selected Image' : 'Selected Video'
                  }
                  className="rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {processingVideos.length > 0 && (
        <div className="mt-4">
          <p className="text-muted-foreground text-sm">
            Processing {processingVideos.length} video(s)... This may take a few
            minutes.
          </p>
        </div>
      )}
    </div>
  );
};

// Helper component for thumbnails
const MediaThumbnail = ({
  type,
  itemValue,
  thumbnailUrl,
  isSelected,
  onToggle,
}: {
  type: 'url' | 'playbackId';
  itemValue: string;
  thumbnailUrl: string;
  isSelected: boolean;
  onToggle: (item: { type: 'url' | 'playbackId'; value: string }) => void;
}) => (
  <div
    onClick={() => onToggle({ type, value: itemValue })}
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

'use client';

import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
  const supabase = createClient();
  const router = useRouter();

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
    if (maxSelection === 1) {
      onChange(items);
    } else {
      const newItems = [...items];
      items.forEach((item) => {
        if (
          !newItems.some(
            (existing) =>
              existing.identifier === item.identifier ||
              (existing.type === item.type && existing.value === item.value),
          )
        ) {
          newItems.push(item);
        }
      });
      onChange(newItems.slice(0, maxSelection));
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel(`videos-${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'videos' },
        (payload) => {
          const updatedVideo = payload.new;
          console.log('payload received for', id);

          if (updatedVideo.playback_id) {
            console.log('updating video', updatedVideo);
            console.log(`current value for ${id}`, value);

            // Find and update the processed video in value array
            const updatedValue = value.map((item) => {
              if (item.identifier === updatedVideo.identifier) {
                return {
                  type: 'playbackId' as const,
                  value: updatedVideo.playback_id,
                  identifier: updatedVideo.identifier,
                };
              }
              return item;
            });

            // Only update if there were changes
            if (JSON.stringify(updatedValue) !== JSON.stringify(value)) {
              onChange(updatedValue);
              router.refresh();
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, value, onChange, router, id]);

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

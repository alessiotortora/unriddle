'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MediaSelectorProps {
  images: any[];
  videos: any[];
  value: { type: 'url' | 'playbackId'; value: string }[];
  onChange: (
    mediaItems: { type: 'url' | 'playbackId'; value: string }[],
  ) => void;
  maxSelection?: number;
  title: string;
}

export const MediaSelector = ({
  images,
  videos,
  value,
  onChange,
  maxSelection = 8,
  title,
}: MediaSelectorProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const toggleMediaItem = (mediaItem: {
    type: 'url' | 'playbackId';
    value: string;
  }) => {
    const exists = value.some(
      (item) => item.type === mediaItem.type && item.value === mediaItem.value,
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
        <PopoverContent className="bg-secondary w-full p-4">
          <ScrollArea>
            <div>
              <p className="text-muted-foreground text-xs">Images</p>
              <div className="flex flex-wrap gap-2">
                {images.map((image) => {
                  const isSelected = value.some(
                    (item) => item.type === 'url' && item.value === image.url,
                  );
                  return (
                    <div
                      key={image.id}
                      onClick={() =>
                        toggleMediaItem({ type: 'url', value: image.url })
                      }
                      className={`relative h-16 w-32 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <Image
                        src={image.url}
                        fill
                        alt={image.id}
                        className="rounded-md"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-2">
              <p className="text-muted-foreground text-xs">Videos</p>
              <div className="flex flex-wrap gap-2">
                {videos.map((video) => {
                  const thumbnailUrl = `https://image.mux.com/${video.playbackId}/thumbnail.webp`;
                  const isSelected = value.some(
                    (item) =>
                      item.type === 'playbackId' &&
                      item.value === video.playbackId,
                  );
                  return (
                    <div
                      key={video.id}
                      onClick={() =>
                        toggleMediaItem({
                          type: 'playbackId',
                          value: video.playbackId,
                        })
                      }
                      className={`relative h-16 w-32 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <Image
                        src={thumbnailUrl}
                        fill
                        alt="thumbnail"
                        className="rounded-md"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {maxSelection > 1 && value.length > 0 && (
        <div className="mt-4">
          <p>Selected Media Items:</p>
          <div className="flex flex-wrap gap-2">
            {value.map((item, index) => (
              <div key={index} className="relative h-16 w-32">
                {item.type === 'url' ? (
                  <Image
                    src={item.value}
                    fill
                    alt="Selected Image"
                    className="rounded-md"
                  />
                ) : (
                  <Image
                    src={`https://image.mux.com/${item.value}/thumbnail.webp`}
                    fill
                    alt="Selected Video"
                    className="rounded-md"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

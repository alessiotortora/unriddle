'use client';

import { useState } from 'react';

import Image from 'next/image';

import { UseFormSetValue } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Image as Images, Video } from '@/db/schema';

import { MediaSelector } from './media-selector';

interface CoverSectionProps {
  control: any;
  initialCoverImage?: string | null;
  initialCoverVideo?: string | null;
  images: Images[];
  videos: Video[];
  setValue: UseFormSetValue<any>;
}

export function CoverSection({
  control,
  initialCoverImage,
  initialCoverVideo,
  images,
  videos,
  setValue,
}: CoverSectionProps) {
  const [isProcessingCover, setIsProcessingCover] = useState(false);

  const initialValue = initialCoverImage
    ? [{ type: 'url' as const, value: initialCoverImage }]
    : initialCoverVideo
      ? [{ type: 'playbackId' as const, value: initialCoverVideo }]
      : [];

  console.log('cover rerendered');

  return (
    <div className="relative mb-4 mt-4 flex h-64 w-full items-center justify-center rounded-md">
      <FormField
        control={control}
        name="coverMedia"
        render={({ field }) => {
          const selectedCoverMedia = field.value?.[0];

          return (
            <FormItem className="h-full w-full">
              <FormControl>
                <div className="relative h-full w-full">
                  {selectedCoverMedia ? (
                    selectedCoverMedia.type === 'url' ? (
                      <Image
                        src={selectedCoverMedia.value || ''}
                        fill
                        alt="Selected Media"
                        className="rounded-md object-cover"
                      />
                    ) : isProcessingCover ? (
                      <span className="text-muted-foreground">
                        Processing video cover... This may take a few minutes.
                      </span>
                    ) : (
                      <Image
                        src={`https://image.mux.com/${selectedCoverMedia.value}/thumbnail.webp`}
                        fill
                        alt="Selected Media GIF"
                        className="rounded-md object-cover"
                      />
                    )
                  ) : (
                    <span className="text-muted-foreground">
                      Please add a cover by selecting a media item.
                    </span>
                  )}

                  <div className="absolute right-2 top-2 flex gap-2">
                    <MediaSelector
                      id="cover"
                      images={images}
                      videos={videos}
                      value={field.value || []}
                      onChange={(mediaItems) => {
                        field.onChange(mediaItems);
                        const mediaItem = mediaItems[0];
                        if (mediaItem) {
                          if (mediaItem.type === 'url') {
                            setValue('coverImageUrl', mediaItem.value);
                            setValue('coverVideoPlaybackId', null);
                            setIsProcessingCover(false);
                          } else if (mediaItem.type === 'playbackId') {
                            setValue('coverVideoPlaybackId', mediaItem.value);
                            setValue('coverImageUrl', null);
                            setIsProcessingCover(!mediaItem.value);
                          }
                        } else {
                          setValue('coverImageUrl', null);
                          setValue('coverVideoPlaybackId', null);
                        }
                      }}
                      maxSelection={1}
                      title={selectedCoverMedia ? 'Change Cover' : 'Add Cover'}
                      side="left"
                    />
                    {selectedCoverMedia && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          field.onChange([]);
                          setValue('coverImageUrl', null);
                          setValue('coverVideoPlaybackId', null);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </FormControl>
            </FormItem>
          );
        }}
      />
    </div>
  );
}

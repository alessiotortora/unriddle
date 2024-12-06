'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Loader2 } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Image as Images, Video } from '@/db/schema';

import { MediaSelector } from './media-selector';

const LoadingSpinner = () => (
  <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100">
    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
  </div>
);

interface CoverSectionProps {
  control: any;
  images: Images[];
  videos: Video[];
  setValue: UseFormSetValue<any>;
}

export function CoverSection({
  control,
  images,
  videos,
  setValue,
}: CoverSectionProps) {
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
                    !selectedCoverMedia.value ||
                    (selectedCoverMedia.type === 'playbackId' &&
                      !selectedCoverMedia.value) ? (
                      <LoadingSpinner />
                    ) : selectedCoverMedia.type === 'url' ? (
                      <Image
                        src={selectedCoverMedia.value || ''}
                        fill
                        alt="Selected Media"
                        className="rounded-md object-cover"
                      />
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
                            setValue('coverImageId', mediaItem.id);
                            setValue('coverVideoId', null);
                          } else if (mediaItem.type === 'playbackId') {
                            setValue('coverVideoId', mediaItem.id);
                            setValue('coverImageId', null);
                          }
                        } else {
                          setValue('coverImageId', null);
                          setValue('coverVideoId', null);
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
                          setValue('coverImageId', null);
                          setValue('coverVideoId', null);
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

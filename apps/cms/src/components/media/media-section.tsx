'use client';

import { useState } from 'react';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Image as Images, Video } from '@/db/schema';

import { MediaSelector } from './media-selector';

interface MediaSectionProps {
  control: any;
  initialMedia?: {
    id: string;
    type: 'url' | 'playbackId';
    value: string | null;
    identifier?: string;
  }[];
  images: Images[];
  videos: Video[];
}

export function MediaSection({
  control,
  initialMedia = [],
  images,
  videos,
}: MediaSectionProps) {
  const [generalMediaValue, setGeneralMediaValue] = useState<
    {
      id?: string;
      type: 'url' | 'playbackId';
      value: string | null;
      identifier?: string;
    }[]
  >(initialMedia);

  return (
    <FormField
      control={control}
      name="media"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Media Items</FormLabel>
          <FormControl>
            <MediaSelector
              id="media"
              title="Select Media"
              side="bottom"
              images={images}
              videos={videos}
              value={generalMediaValue}
              maxSelection={8}
              onChange={(mediaItems) => {
                setGeneralMediaValue(mediaItems);
                field.onChange(mediaItems);
              }}
            />
          </FormControl>
          <FormDescription>
            Select up to 8 images or videos that showcase your project. Examples
            could include screenshots, project photos, or demo videos.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

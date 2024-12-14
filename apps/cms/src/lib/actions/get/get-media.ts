'use server';

import { desc } from 'drizzle-orm';


import { db } from '@/db';
import { Image, images } from '@/db/schema/images';
import { Video, videos } from '@/db/schema/videos';

export async function getMedia(spaceId: string): Promise<{
  images: Image[];
  videos: Video[];
}> {


  const [spaceImages, spaceVideos] = await Promise.all([
    db.query.images.findMany({
      where: (images, { eq }) => eq(images.spaceId, spaceId),
      orderBy: [desc(images.createdAt)],
    }),
    db.query.videos.findMany({
      where: (videos, { eq }) => eq(videos.spaceId, spaceId),
      orderBy: [desc(videos.createdAt)],
    }),
  ]);

  return {
    images: spaceImages,
    videos: spaceVideos.filter((video) => video.status === 'ready'),
  };
}

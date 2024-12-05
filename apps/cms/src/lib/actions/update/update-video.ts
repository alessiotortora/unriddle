'use server';

import { revalidatePath } from 'next/cache';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { videoStatusEnum, videos } from '@/db/schema/videos';

export async function updateVideo(
  assetId: string,
  videoId: string,
  identifier: string,
  duration: number,
  aspectRatio: string,
) {
  try {
    const existingVideo = await db.query.videos.findFirst({
      where: eq(videos.identifier, identifier),
    });

    if (!existingVideo) {
      throw new Error(`Video with identifier ${identifier} not found`);
    }

    await db
      .update(videos)
      .set({
        playbackId: videoId,
        assetId: assetId,
        duration: duration,
        aspectRatio: aspectRatio,
        status: videoStatusEnum.enumValues[1], // 'ready'
        updatedAt: new Date(),
      })
      .where(eq(videos.identifier, identifier));

    console.log('Video updated in the database');

    // Revalidate the path after video is updated
    revalidatePath(`/${existingVideo.spaceId}/media`, 'layout');
  } catch (error) {
    console.error('Error updating video:', error);
    throw new Error('Failed to update video');
  }
}

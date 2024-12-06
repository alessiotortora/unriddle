'use server';

import { db } from '@/db';
import { videoStatusEnum, videos } from '@/db/schema/videos';

export async function createVideo(
  spaceId: string,
  identifier: string,
  bytes: number,
) {
  try {
    const [video] = await db
      .insert(videos)
      .values({
        spaceId,
        assetId: '',
        identifier,
        playbackId: '',
        bytes: bytes,
        status: videoStatusEnum.enumValues[0],
      })
      .returning();

    return video;
  } catch (error) {
    console.error('Error creating video:', error);
    throw new Error('Failed to create video');
  }
}

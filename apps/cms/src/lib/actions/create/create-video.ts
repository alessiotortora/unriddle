'use server';

import { db } from '@/db';
import { videoStatusEnum, videos } from '@/db/schema/videos';

export async function createVideo(spaceId: string, identifier: string) {
  try {
    await db.insert(videos).values({
      spaceId,
      assetId: '',
      identifier,
      playbackId: '',
      status: videoStatusEnum.enumValues[0],
    });
    console.log('Video created in the database');
  } catch (error) {
    console.error('Error creating video:', error);
    throw new Error('Failed to create video');
  }
}

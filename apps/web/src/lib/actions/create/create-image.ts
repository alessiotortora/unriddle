'use server';

import { db } from '@/db';
import { images } from '@/db/schema/images';
import { NewImage } from '@/db/schema/images';
import { revalidatePath } from 'next/cache';

interface ImageInput {
  publicId: string;
  url: string;
  bytes: number;
  resolution: {
    width: number;
    height: number;
  };
  format: string;
  alt?: string;
}

export async function createImage(imageInputs: ImageInput[], spaceId: string) {
  // Validate input
  if (!imageInputs || !Array.isArray(imageInputs)) {
    throw new Error('Images must be an array');
  }

  try {
    const imagesToInsert: NewImage[] = imageInputs.map((image) => ({
      spaceId,
      publicId: image.publicId,
      url: image.url,
      bytes: image.bytes,
      resolution: image.resolution,
      format: image.format,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const newImages = await db.insert(images).values(imagesToInsert).returning();

    // Revalidate the path after images are created
    revalidatePath(`/dashboard/${spaceId}/projects/[projectId]`, 'page');

    return {
      message: 'Images inserted successfully',
      images: newImages,
    };
  } catch (error) {
    console.error('Error inserting images:', error);
    throw new Error('Failed to insert images');
  }
}

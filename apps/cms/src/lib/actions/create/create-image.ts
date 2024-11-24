'use server';

import { db } from '@/db';
import { images } from '@/db/schema/images';
import { NewImage } from '@/db/schema/images';

interface ImageInput {
  publicId: string;
  url: string;
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
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const newImages = await db.insert(images).values(imagesToInsert).returning();

    return {
      message: 'Images inserted successfully',
      images: newImages,
    };
  } catch (error) {
    console.error('Error inserting images:', error);
    throw new Error('Failed to insert images');
  }
}

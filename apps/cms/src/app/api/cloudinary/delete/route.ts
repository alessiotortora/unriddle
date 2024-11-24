import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/db';
import { images } from '@/db/schema/images';
import { eq } from 'drizzle-orm';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request) {
  try {
    const { imageId, publicId } = await request.json();

    // 1. Delete the image from Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    if (cloudinaryResponse.result !== 'ok') {
      throw new Error(
        `Cloudinary deletion failed: ${cloudinaryResponse.result}`,
      );
    }

    // 2. Delete the image from the database using Drizzle
    await db.delete(images).where(eq(images.id, imageId));

    return NextResponse.json(
      { message: 'Image deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { message: 'Failed to delete image' },
      { status: 500 },
    );
  }
}

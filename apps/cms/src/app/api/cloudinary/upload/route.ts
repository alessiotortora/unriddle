// next
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// utils
import prisma from '@/lib/prisma';

interface Image {
  publicId: string;
  url: string;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { images } = body; // Expect images and optional projectId in the body

  if (!images || !Array.isArray(images)) {
    return NextResponse.json(
      { error: 'Images must be an array' },
      { status: 400 },
    );
  }

  try {
    // Insert multiple images into the database, associated with a project if provided
    const newImages = await prisma.image.createMany({
      data: images.map((image: Image) => ({
        publicId: image.publicId,
        url: image.url,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });

    return NextResponse.json({
      message: 'Images inserted successfully',
      newImages,
    });
  } catch (error) {
    console.error('Error inserting images:', error);
    return NextResponse.json(
      { error: 'Failed to insert images' },
      { status: 500 },
    );
  }
}

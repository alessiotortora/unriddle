import { NextResponse } from 'next/server';
import { Mux } from '@mux/mux-node';
import { db } from '@/db';
import { videos } from '@/db/schema/videos';
import { eq } from 'drizzle-orm';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function DELETE(request: Request) {
  try {
    const { videoId, assetId } = await request.json();

    // 1. Delete the video from Mux
    await mux.video.assets.delete(assetId);

    // 2. Delete the video from the database using Drizzle
    await db.delete(videos).where(eq(videos.id, videoId));

    return NextResponse.json(
      { message: 'Video deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { message: 'Failed to delete video' },
      { status: 500 },
    );
  }
}

// next
import { NextResponse } from 'next/server';

// actions
import { updateVideo } from '@/lib/actions/update/update-video';

export async function POST(request: Request) {
  const body = await request.json();
  const { type, data } = body;

  try {
    if (type === 'video.asset.ready') {
      const assetId = data.id as string;
      const videoId = data.playback_ids[0].id as string;
      const identifier = data.passthrough as string;
      await updateVideo(assetId, videoId, identifier);
      console.log('Video updated');
    }

    return NextResponse.json({ message: 'ok' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 },
    );
  }
}

// next
import { NextRequest, NextResponse } from 'next/server';

// mux
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function POST(request: NextRequest) {
  const { identifier } = await request.json();

  try {
    const directUpload = await mux.video.uploads.create({
      cors_origin: '*',
      new_asset_settings: {
        playback_policy: ['public'],
        encoding_tier: 'baseline',
        passthrough: identifier,
      },
    });

    console.log(
      'Direct upload URL:',
      directUpload.new_asset_settings?.passthrough,
    );

    return NextResponse.json({ muxUploadUrl: directUpload.url });
  } catch (error) {
    console.error('Error creating Mux upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to create upload URL' },
      { status: 500 },
    );
  }
}

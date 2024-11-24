// next
import { NextResponse } from 'next/server';

// cloudinary
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.v2.utils.api_sign_request(
    { timestamp, upload_preset: process.env.NEXT_PUBLIC_UPLOAD_PRESET },
    process.env.CLOUDINARY_API_SECRET as string,
  );

  return NextResponse.json({ signature, timestamp });
}

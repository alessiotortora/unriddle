import { v4 as uuidv4 } from 'uuid';

import { createVideo } from './create/create-video';

export const uploadToMux = async (
  files: File[],
  spaceId: string | string[],
) => {
  const uploadPromises = files.map(async (file) => {
    const identifier = uuidv4();

    const response = await fetch('/api/mux/url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier }),
    });
    const { muxUploadUrl } = await response.json();

    if (!muxUploadUrl) {
      throw new Error('Failed to retrieve Mux upload URL');
    }

    // Upload each video file to the corresponding Mux URL
    const uploadResponse = await fetch(muxUploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) throw new Error('Upload failed');

    await createVideo(spaceId as string, identifier, file.size);

    // Return the identifier for tracking
    return { status: uploadResponse.status, fileName: file.name, identifier };
  });

  // Wait for all videos to be uploaded
  const results = await Promise.all(uploadPromises);

  // Return the results of all uploads (if needed)
  return results;
};

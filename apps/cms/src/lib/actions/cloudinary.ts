export const uploadToCloudinary = async (files: File[]) => {
  // Step 1: Fetch the signature and timestamp from your backend API
  const response = await fetch('/api/cloudinary/signature', { method: 'POST' });
  const { signature, timestamp } = await response.json();

  // Step 2: Use Promise.all to upload all files concurrently
  const uploadPromises = files.map((file) => {
    const formData = new FormData();

    // Step 3: Append each file and necessary signed upload parameters to the formData
    formData.append('file', file);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append(
      'api_key',
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
    );
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_UPLOAD_PRESET || '',
    );

    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`;

    // Step 4: Return the fetch call for each file upload, which will resolve into a Promise
    return fetch(url, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (!response.ok) throw new Error('Cloudinary upload failed');
      return response.json();
    });
  });

  // Step 5: Wait for all file uploads to complete
  const results = await Promise.all(uploadPromises);

  return results;
};

/** Shared image upload limit used across the app */
export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_IMAGE_UPLOAD_LABEL = "10MB";

export async function uploadToCloudinary(file: File) {
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    throw new Error(`Image must be ${MAX_IMAGE_UPLOAD_LABEL} or smaller`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Image upload failed");
  }

  return data.secure_url;
}

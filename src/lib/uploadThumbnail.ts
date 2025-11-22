import { createClient } from "@/lib/supabase/client";

export async function uploadThumbnail(projectId: string, blob: Blob): Promise<string | null> {
  const supabase = createClient();

  const fileName = `${projectId}_${Date.now()}.jpg`;
  const filePath = `thumbnails/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("thumbnails")
    .upload(filePath, blob, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (uploadError) {
    console.error("Error uploading thumbnail:", uploadError.message);
    return null;
  }

  const { data } = supabase.storage
    .from("thumbnails")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

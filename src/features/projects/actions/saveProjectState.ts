"use server";

import { createClient } from "@/lib/supabase/server";
import type { SceneConfig } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function saveProjectState(
  projectId: string, 
  config: SceneConfig, 
  thumbnailUrl?: string
) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated" };
  }

  const updateData: any = {
    scene_config: config,
    updated_at: new Date().toISOString()
  };

  if (thumbnailUrl) {
    updateData.thumbnail_url = thumbnailUrl;
  }

  const { error } = await supabase
    .from("projects")
    .update(updateData)
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) {
    console.log("Error saving project state:", error.message);
    return { error: error.message };
  }

  revalidatePath(`/project/${projectId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

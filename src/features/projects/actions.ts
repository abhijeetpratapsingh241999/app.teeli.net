"use server";

import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function getUserProjects(): Promise<Project[]> {
  const supabase = await createClient();

  // Step 1: Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.log("Auth error:", authError.message);
    return [];
  }

  if (!user) {
    console.log("No user found");
    return [];
  }

  // Step 2: Query projects for this user
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Error fetching projects:", error.message);
    return [];
  }

  return data || [];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log("Auth error or no user");
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.log("Error fetching project:", error.message);
    return null;
  }

  return data;
}

export async function createProject(
  name: string,
  file_url?: string,
  thumbnail_url?: string
) {
  const supabase = await createClient();

  // Validate user authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.log("Auth error:", authError.message);
    return { error: "Authentication failed" };
  }

  if (!user) {
    console.log("No user found");
    return { error: "Not authenticated" };
  }

  // Insert new project
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: name,
      file_url: file_url || null,
      thumbnail_url: thumbnail_url || null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.log("Error creating project:", error.message);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { data };
}

export async function renameProject(id: string, name: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("projects")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated" };
  }

  // Get project data to delete files
  const { data: project } = await supabase
    .from("projects")
    .select("file_url, thumbnail_url")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  // Delete files from storage
  if (project?.file_url) {
    const filePath = project.file_url.split('/').pop();
    if (filePath) {
      await supabase.storage.from("models").remove([`models/${filePath}`]);
    }
  }

  if (project?.thumbnail_url) {
    const thumbPath = project.thumbnail_url.split('/').pop();
    if (thumbPath) {
      await supabase.storage.from("thumbnails").remove([`thumbnails/${thumbPath}`]);
    }
  }

  // Delete project from database
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getPublicProject(id: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log("Error fetching public project:", error.message);
    return null;
  }

  return data;
}

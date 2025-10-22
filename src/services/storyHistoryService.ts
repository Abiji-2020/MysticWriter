import { getInsforgeClient } from "@/lib/insforge/client";

export interface StoryHistoryEntry {
  id: string;
  storyId: string;
  userId: string;
  action: "created" | "updated" | "segment_added" | "character_added";
  description?: string;
  changes?: Record<string, any>;
  createdAt: string;
}

export const storyHistoryService = {
  /**
   * Log story action to history
   */
  async logAction(
    storyId: string,
    userId: string,
    action: "created" | "updated" | "segment_added" | "character_added",
    description?: string,
    changes?: Record<string, any>,
  ): Promise<StoryHistoryEntry> {
    try {
      const client = getInsforgeClient();

      const { data, error } = await client.database
        .from("story_history")
        .insert([
          {
            story_id: storyId,
            user_id: userId,
            action,
            description,
            changes: changes || null,
          },
        ])
        .select()
        .single();

      if (error || !data) {
        throw new Error(error?.message || "Failed to log story action");
      }

      return {
        id: data.id,
        storyId: data.story_id,
        userId: data.user_id,
        action: data.action,
        description: data.description,
        changes: data.changes,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error("Story history log error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to log story action");
    }
  },

  /**
   * Get story history
   */
  async getStoryHistory(storyId: string): Promise<StoryHistoryEntry[]> {
    try {
      const client = getInsforgeClient();

      const { data, error } = await client.database
        .from("story_history")
        .select("*")
        .eq("story_id", storyId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message || "Failed to fetch story history");
      }

      return (data || []).map((entry: any) => ({
        id: entry.id,
        storyId: entry.story_id,
        userId: entry.user_id,
        action: entry.action,
        description: entry.description,
        changes: entry.changes,
        createdAt: entry.created_at,
      }));
    } catch (error) {
      console.error("Get story history error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to fetch story history");
    }
  },

  /**
   * Get user's story history
   */
  async getUserStoryHistory(userId: string): Promise<StoryHistoryEntry[]> {
    try {
      const client = getInsforgeClient();

      const { data, error } = await client.database
        .from("story_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message || "Failed to fetch user story history");
      }

      return (data || []).map((entry: any) => ({
        id: entry.id,
        storyId: entry.story_id,
        userId: entry.user_id,
        action: entry.action,
        description: entry.description,
        changes: entry.changes,
        createdAt: entry.created_at,
      }));
    } catch (error) {
      console.error("Get user story history error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to fetch user story history");
    }
  },
};

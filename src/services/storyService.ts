import { getInsforgeClient } from "@/lib/insforge/client";

export interface StorySegment {
  id: string;
  text: string;
  author: "user" | "ai";
  createdAt: string;
}

export interface Story {
  id: string;
  title: string;
  userId: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  segments: StorySegment[];
}

export interface CreateStoryInput {
  title: string;
  userId: string;
  initialText?: string;
}

export const storyService = {
  /**
   * Create a new story
   */
  async createStory(input: CreateStoryInput): Promise<Story> {
    try {
      const client = getInsforgeClient();

      // Create story record
      const { data: storyData, error: storyError } = await client.database
        .from("stories")
        .insert([
          {
            title: input.title,
            user_id: input.userId,
            word_count: input.initialText
              ? input.initialText.split(/\s+/).filter((w) => w.length > 0)
                  .length
              : 0,
          },
        ])
        .select()
        .single();

      if (storyError || !storyData) {
        throw new Error(storyError?.message || "Failed to create story");
      }

      // Create initial segment if provided
      let segments: StorySegment[] = [];
      if (input.initialText?.trim()) {
        const { data: segmentData, error: segmentError } = await client.database
          .from("story_segments")
          .insert([
            {
              story_id: storyData.id,
              text: input.initialText,
              author: "user",
            },
          ])
          .select()
          .single();

        if (!segmentError && segmentData) {
          segments = [
            {
              id: segmentData.id,
              text: segmentData.text,
              author: segmentData.author,
              createdAt: segmentData.created_at,
            },
          ];
        }
      }

      return {
        id: storyData.id,
        title: storyData.title,
        userId: storyData.user_id,
        wordCount: storyData.word_count,
        createdAt: storyData.created_at,
        updatedAt: storyData.updated_at,
        segments,
      };
    } catch (error) {
      console.error("Create story error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to create story");
    }
  },

  /**
   * Get user's stories
   */
  async getUserStories(userId: string): Promise<Story[]> {
    try {
      const client = getInsforgeClient();

      const { data, error } = await client.database
        .from("stories")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) {
        throw new Error(error.message || "Failed to fetch stories");
      }

      return (data || []).map((story: any) => ({
        id: story.id,
        title: story.title,
        userId: story.user_id,
        wordCount: story.word_count,
        createdAt: story.created_at,
        updatedAt: story.updated_at,
        segments: [],
      }));
    } catch (error) {
      console.error("Get user stories error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to fetch stories");
    }
  },

  /**
   * Get story with all segments
   */
  async getStory(storyId: string): Promise<Story> {
    try {
      const client = getInsforgeClient();

      // Get story
      const { data: storyData, error: storyError } = await client.database
        .from("stories")
        .select("*")
        .eq("id", storyId)
        .single();

      if (storyError || !storyData) {
        throw new Error(storyError?.message || "Story not found");
      }

      // Get segments
      const { data: segmentsData, error: segmentsError } = await client.database
        .from("story_segments")
        .select("*")
        .eq("story_id", storyId)
        .order("created_at", { ascending: true });

      if (segmentsError) {
        throw new Error(segmentsError.message || "Failed to fetch segments");
      }

      return {
        id: storyData.id,
        title: storyData.title,
        userId: storyData.user_id,
        wordCount: storyData.word_count,
        createdAt: storyData.created_at,
        updatedAt: storyData.updated_at,
        segments: (segmentsData || []).map((segment: any) => ({
          id: segment.id,
          text: segment.text,
          author: segment.author,
          createdAt: segment.created_at,
        })),
      };
    } catch (error) {
      console.error("Get story error:", error);
      throw error instanceof Error ? error : new Error("Failed to fetch story");
    }
  },

  /**
   * Add segment to story
   */
  async addSegment(
    storyId: string,
    text: string,
    author: "user" | "ai",
  ): Promise<StorySegment> {
    try {
      const client = getInsforgeClient();

      // Add segment
      const { data: segmentData, error: segmentError } = await client.database
        .from("story_segments")
        .insert([
          {
            story_id: storyId,
            text,
            author,
          },
        ])
        .select()
        .single();

      if (segmentError || !segmentData) {
        throw new Error(segmentError?.message || "Failed to add segment");
      }

      // Get current story to update word count
      const { data: storyData } = await client.database
        .from("stories")
        .select("word_count")
        .eq("id", storyId)
        .single();

      if (storyData) {
        const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
        const newWordCount = (storyData.word_count || 0) + wordCount;
        await client.database
          .from("stories")
          .update({ word_count: newWordCount })
          .eq("id", storyId);
      }

      return {
        id: segmentData.id,
        text: segmentData.text,
        author: segmentData.author,
        createdAt: segmentData.created_at,
      };
    } catch (error) {
      console.error("Add segment error:", error);
      throw error instanceof Error ? error : new Error("Failed to add segment");
    }
  },

  /**
   * Update story title
   */
  async updateStoryTitle(storyId: string, title: string): Promise<void> {
    try {
      const client = getInsforgeClient();

      const { error } = await client.database
        .from("stories")
        .update({ title })
        .eq("id", storyId);

      if (error) {
        throw new Error(error.message || "Failed to update story");
      }
    } catch (error) {
      console.error("Update story error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to update story");
    }
  },

  /**
   * Delete story
   */
  async deleteStory(storyId: string): Promise<void> {
    try {
      const client = getInsforgeClient();

      // Delete segments first
      await client.database
        .from("story_segments")
        .delete()
        .eq("story_id", storyId);

      // Delete story
      const { error } = await client.database
        .from("stories")
        .delete()
        .eq("id", storyId);

      if (error) {
        throw new Error(error.message || "Failed to delete story");
      }
    } catch (error) {
      console.error("Delete story error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to delete story");
    }
  },

  /**
   * Get story segments
   */
  async getStorySegments(storyId: string): Promise<StorySegment[]> {
    try {
      const client = getInsforgeClient();

      const { data, error } = await client.database
        .from("story_segments")
        .select("*")
        .eq("story_id", storyId)
        .order("created_at", { ascending: true });

      if (error) {
        throw new Error(error.message || "Failed to fetch segments");
      }

      return (data || []).map((segment: any) => ({
        id: segment.id,
        text: segment.text,
        author: segment.author,
        createdAt: segment.created_at,
      }));
    } catch (error) {
      console.error("Get segments error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to fetch segments");
    }
  },
};

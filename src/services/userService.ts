import { getInsforgeClient } from "@/lib/insforge/client";

export interface UserProfile {
  id: string;
  email: string;
  nickname?: string;
  bio?: string;
  avatar_url?: string;
  theme: "light" | "dark" | "system";
  notifications_enabled: boolean;
  private_profile: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications_enabled: boolean;
  private_profile: boolean;
  email_notifications: boolean;
  story_suggestions: boolean;
}

export interface WritingStats {
  total_words: number;
  total_stories: number;
  total_segments: number;
  ai_segments: number;
  user_segments: number;
  average_story_length: number;
  longest_story_id?: string;
  longest_story_title?: string;
  longest_story_words: number;
  streak_days: number;
  last_written_at?: string;
}

export const userService = {
  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const client = getInsforgeClient();

      const { data, error } = await client.database
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        throw new Error(error?.message || "Profile not found");
      }

      return {
        id: data.id,
        email: data.email,
        nickname: data.nickname,
        bio: data.bio,
        avatar_url: data.avatar_url,
        theme: data.theme || "system",
        notifications_enabled: data.notifications_enabled ?? true,
        private_profile: data.private_profile ?? false,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error) {
      console.error("Get profile error:", error);
      throw error instanceof Error ? error : new Error("Failed to get profile");
    }
  },

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    updates: Partial<
      Omit<UserProfile, "id" | "email" | "created_at" | "updated_at">
    >,
  ): Promise<UserProfile> {
    try {
      const client = getInsforgeClient();

      const updateData: any = {};
      if (updates.nickname !== undefined)
        updateData.nickname = updates.nickname;
      if (updates.bio !== undefined) updateData.bio = updates.bio;
      if (updates.avatar_url !== undefined)
        updateData.avatar_url = updates.avatar_url;
      if (updates.theme !== undefined) updateData.theme = updates.theme;
      if (updates.notifications_enabled !== undefined)
        updateData.notifications_enabled = updates.notifications_enabled;
      if (updates.private_profile !== undefined)
        updateData.private_profile = updates.private_profile;

      const { data, error } = await client.database
        .from("user_profiles")
        .update(updateData)
        .eq("id", userId)
        .select()
        .single();

      if (error || !data) {
        throw new Error(error?.message || "Failed to update profile");
      }

      return {
        id: data.id,
        email: data.email,
        nickname: data.nickname,
        bio: data.bio,
        avatar_url: data.avatar_url,
        theme: data.theme || "system",
        notifications_enabled: data.notifications_enabled ?? true,
        private_profile: data.private_profile ?? false,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error) {
      console.error("Update profile error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to update profile");
    }
  },

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const profile = await this.getUserProfile(userId);

      return {
        theme: profile.theme,
        notifications_enabled: profile.notifications_enabled,
        private_profile: profile.private_profile,
        email_notifications: true,
        story_suggestions: true,
      };
    } catch (error) {
      console.error("Get preferences error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to get preferences");
    }
  },

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: Partial<UserPreferences>,
  ): Promise<UserPreferences> {
    try {
      const updates: Partial<UserProfile> = {};

      if (preferences.theme !== undefined) updates.theme = preferences.theme;
      if (preferences.notifications_enabled !== undefined)
        updates.notifications_enabled = preferences.notifications_enabled;
      if (preferences.private_profile !== undefined)
        updates.private_profile = preferences.private_profile;

      await this.updateUserProfile(userId, updates);

      return this.getUserPreferences(userId);
    } catch (error) {
      console.error("Update preferences error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to update preferences");
    }
  },

  /**
   * Get user writing statistics
   */
  async getUserWritingStats(userId: string): Promise<WritingStats> {
    try {
      const client = getInsforgeClient();

      // Get all stories for user
      const { data: stories, error: storiesError } = await client.database
        .from("stories")
        .select("id, title, word_count")
        .eq("user_id", userId);

      if (storiesError) throw storiesError;

      const totalStories = stories?.length || 0;
      let totalWords = 0;
      let longestStoryWords = 0;
      let longestStoryId: string | undefined;
      let longestStoryTitle: string | undefined;

      stories?.forEach((story: any) => {
        totalWords += story.word_count || 0;
        if ((story.word_count || 0) > longestStoryWords) {
          longestStoryWords = story.word_count || 0;
          longestStoryId = story.id;
          longestStoryTitle = story.title;
        }
      });

      // Get all segments
      const { data: segments, error: segmentsError } = await client.database
        .from("story_segments")
        .select("author")
        .in("story_id", stories?.map((s: any) => s.id) || []);

      if (segmentsError) throw segmentsError;

      const totalSegments = segments?.length || 0;
      const aiSegments =
        segments?.filter((s: any) => s.author === "ai").length || 0;
      const userSegments =
        segments?.filter((s: any) => s.author === "user").length || 0;

      return {
        total_words: totalWords,
        total_stories: totalStories,
        total_segments: totalSegments,
        ai_segments: aiSegments,
        user_segments: userSegments,
        average_story_length:
          totalStories > 0 ? Math.round(totalWords / totalStories) : 0,
        longest_story_id: longestStoryId,
        longest_story_title: longestStoryTitle,
        longest_story_words: longestStoryWords,
        streak_days: 7, // TODO: Calculate based on actual data
        last_written_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Get writing stats error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to get writing statistics");
    }
  },

  /**
   * Upload user avatar
   */
  async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      const client = getInsforgeClient();

      const fileName = `avatar-${userId}-${Date.now()}.${file.name.split(".").pop()}`;

      const { data, error } = await client.storage
        .from("user-avatars")
        .upload(fileName, file);

      if (error || !data) {
        throw new Error(error?.message || "Failed to upload avatar");
      }

      // Get public URL
      const url = await client.storage
        .from("user-avatars")
        .getPublicUrl(fileName);

      // Update profile with avatar URL
      await this.updateUserProfile(userId, { avatar_url: url });

      return url;
    } catch (error) {
      console.error("Upload avatar error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to upload avatar");
    }
  },

  /**
   * Delete user account
   */
  async deleteAccount(userId: string): Promise<void> {
    try {
      const client = getInsforgeClient();

      // Delete user profile
      const { error } = await client.database
        .from("user_profiles")
        .delete()
        .eq("id", userId);

      if (error) {
        throw new Error(error.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to delete account");
    }
  },
};

import { getInsforgeClient } from "../lib/insforge/client";

export interface WritingAnalytics {
  id: string;
  userId: string;
  date: string;
  wordsWritten: number;
  segmentsAdded: number;
  charactersCreated: number;
  storiesCreated: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsSummary {
  totalWords: number;
  wordsToday: number;
  activeCharacters: number;
  streakDays: number;
}

export const analyticsService = {
  /**
   * Track words written for today
   */
  async trackWordsWritten(
    userId: string,
    wordCount: number,
  ): Promise<WritingAnalytics> {
    try {
      const client = getInsforgeClient();
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      // Try to get today's analytics
      const { data: existing } = await client.database
        .from("writing_analytics")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      if (existing) {
        // Update existing record
        const { data, error } = await client.database
          .from("writing_analytics")
          .update({
            words_written: existing.words_written + wordCount,
            segments_added: existing.segments_added + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw new Error(error.message);

        return {
          id: data.id,
          userId: data.user_id,
          date: data.date,
          wordsWritten: data.words_written,
          segmentsAdded: data.segments_added,
          charactersCreated: data.characters_created,
          storiesCreated: data.stories_created,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      } else {
        // Create new record for today
        const { data, error } = await client.database
          .from("writing_analytics")
          .insert([
            {
              user_id: userId,
              date: today,
              words_written: wordCount,
              segments_added: 1,
              characters_created: 0,
              stories_created: 0,
            },
          ])
          .select()
          .single();

        if (error) throw new Error(error.message);

        return {
          id: data.id,
          userId: data.user_id,
          date: data.date,
          wordsWritten: data.words_written,
          segmentsAdded: data.segments_added,
          charactersCreated: data.characters_created,
          storiesCreated: data.stories_created,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (error) {
      console.error("Track words error:", error);
      throw error instanceof Error ? error : new Error("Failed to track words");
    }
  },

  /**
   * Track character creation
   */
  async trackCharacterCreated(userId: string): Promise<void> {
    try {
      const client = getInsforgeClient();
      const today = new Date().toISOString().split("T")[0];

      const { data: existing } = await client.database
        .from("writing_analytics")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      if (existing) {
        await client.database
          .from("writing_analytics")
          .update({
            characters_created: existing.characters_created + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await client.database.from("writing_analytics").insert([
          {
            user_id: userId,
            date: today,
            words_written: 0,
            segments_added: 0,
            characters_created: 1,
            stories_created: 0,
          },
        ]);
      }
    } catch (error) {
      console.error("Track character error:", error);
    }
  },

  /**
   * Track story creation
   */
  async trackStoryCreated(userId: string): Promise<void> {
    try {
      const client = getInsforgeClient();
      const today = new Date().toISOString().split("T")[0];

      const { data: existing } = await client.database
        .from("writing_analytics")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      if (existing) {
        await client.database
          .from("writing_analytics")
          .update({
            stories_created: existing.stories_created + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await client.database.from("writing_analytics").insert([
          {
            user_id: userId,
            date: today,
            words_written: 0,
            segments_added: 0,
            characters_created: 0,
            stories_created: 1,
          },
        ]);
      }
    } catch (error) {
      console.error("Track story error:", error);
    }
  },

  /**
   * Get analytics summary for user
   */
  async getAnalyticsSummary(userId: string): Promise<AnalyticsSummary> {
    try {
      const client = getInsforgeClient();
      const today = new Date().toISOString().split("T")[0];

      // Get all analytics records ordered by date
      const { data: allRecords, error } = await client.database
        .from("writing_analytics")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) throw new Error(error.message);

      // Calculate total words across all days
      const totalWords =
        allRecords?.reduce((sum, record) => sum + record.words_written, 0) || 0;

      // Get today's words
      const todayRecord = allRecords?.find((r) => r.date === today);
      const wordsToday = todayRecord?.words_written || 0;

      // Calculate streak (consecutive days with activity)
      let streakDays = 0;
      if (allRecords && allRecords.length > 0) {
        const sortedRecords = [...allRecords].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (const record of sortedRecords) {
          const recordDate = new Date(record.date);
          recordDate.setHours(0, 0, 0, 0);

          const diffTime = currentDate.getTime() - recordDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === streakDays) {
            if (
              record.words_written > 0 ||
              record.segments_added > 0 ||
              record.characters_created > 0
            ) {
              streakDays++;
            } else {
              break;
            }
          } else {
            break;
          }
        }
      }

      // Get active characters count from characters table
      const { data: characters } = await client.database
        .from("characters")
        .select("id")
        .eq("story_id", userId); // This should be filtered by user's stories

      // Better approach: get characters from user's stories
      const { data: userStories } = await client.database
        .from("stories")
        .select("id")
        .eq("user_id", userId);

      const storyIds = userStories?.map((s) => s.id) || [];

      let activeCharacters = 0;
      if (storyIds.length > 0) {
        const { data: userCharacters } = await client.database
          .from("characters")
          .select("id")
          .in("story_id", storyIds);

        activeCharacters = userCharacters?.length || 0;
      }

      return {
        totalWords,
        wordsToday,
        activeCharacters,
        streakDays,
      };
    } catch (error) {
      console.error("Get analytics summary error:", error);
      // Return default values on error
      return {
        totalWords: 0,
        wordsToday: 0,
        activeCharacters: 0,
        streakDays: 0,
      };
    }
  },

  /**
   * Get analytics for a date range
   */
  async getAnalyticsByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<WritingAnalytics[]> {
    try {
      const client = getInsforgeClient();

      const { data, error } = await client.database
        .from("writing_analytics")
        .select("*")
        .eq("user_id", userId)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: true });

      if (error) throw new Error(error.message);

      return (
        data?.map((record: any) => ({
          id: record.id,
          userId: record.user_id,
          date: record.date,
          wordsWritten: record.words_written,
          segmentsAdded: record.segments_added,
          charactersCreated: record.characters_created,
          storiesCreated: record.stories_created,
          createdAt: record.created_at,
          updatedAt: record.updated_at,
        })) || []
      );
    } catch (error) {
      console.error("Get analytics by date range error:", error);
      return [];
    }
  },
};

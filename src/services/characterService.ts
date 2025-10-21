import { getInsforgeClient } from "@/lib/insforge/client";
import { aiService } from "./aiService";

export interface Character {
  id: string;
  storyId: string;
  name: string;
  description: string;
  role: string;
  avatar?: string;
  traits: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCharacterInput {
  storyId: string;
  name: string;
  role: string;
  traits?: string[];
  generateAvatar?: boolean;
}

export const characterService = {
  /**
   * Create a new character
   */
  async createCharacter(input: CreateCharacterInput): Promise<Character> {
    try {
      const client = getInsforgeClient();

      // Generate character description using AI
      const traitsString =
        (input.traits || []).join(", ") || "mysterious, enigmatic";
      const description = await aiService.generateCharacterDescription(
        input.name,
        traitsString,
      );

      // Create character record
      const { data: characterData, error: characterError } =
        await client.database
          .from("characters")
          .insert([
            {
              story_id: input.storyId,
              name: input.name,
              description,
              role: input.role,
              traits: input.traits || [],
            },
          ])
          .select()
          .single();

      if (characterError || !characterData) {
        throw new Error(
          characterError?.message || "Failed to create character",
        );
      }

      let avatar: string | undefined;

      // Generate avatar if requested
      if (input.generateAvatar) {
        try {
          // Get story context for better avatar generation
          const { data: storyData } = await client.database
            .from("stories")
            .select("title")
            .eq("id", input.storyId)
            .single();

          const storyContext = storyData?.title || "";
          avatar = await aiService.generateCharacterAvatar(
            input.name,
            description,
            storyContext,
          );

          // Update character with avatar
          await client.database
            .from("characters")
            .update({ avatar_url: avatar })
            .eq("id", characterData.id);
        } catch (avatarError) {
          console.warn(
            "Avatar generation failed, continuing without avatar:",
            avatarError,
          );
        }
      }

      return {
        id: characterData.id,
        storyId: characterData.story_id,
        name: characterData.name,
        description: characterData.description,
        role: characterData.role,
        avatar,
        traits: characterData.traits || [],
        createdAt: characterData.created_at,
        updatedAt: characterData.updated_at,
      };
    } catch (error) {
      console.error("Create character error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to create character");
    }
  },

  /**
   * Get story characters
   */
  async getStoryCharacters(storyId: string): Promise<Character[]> {
    try {
      const client = getInsforgeClient();

      const { data, error } = await client.database
        .from("characters")
        .select("*")
        .eq("story_id", storyId)
        .order("created_at", { ascending: true });

      if (error) {
        throw new Error(error.message || "Failed to fetch characters");
      }

      return (data || []).map((character: any) => ({
        id: character.id,
        storyId: character.story_id,
        name: character.name,
        description: character.description,
        role: character.role,
        avatar: character.avatar_url,
        traits: character.traits || [],
        createdAt: character.created_at,
        updatedAt: character.updated_at,
      }));
    } catch (error) {
      console.error("Get characters error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to fetch characters");
    }
  },

  /**
   * Get character by ID
   */
  async getCharacter(characterId: string): Promise<Character> {
    try {
      const client = getInsforgeClient();

      const { data, error } = await client.database
        .from("characters")
        .select("*")
        .eq("id", characterId)
        .single();

      if (error || !data) {
        throw new Error(error?.message || "Character not found");
      }

      return {
        id: data.id,
        storyId: data.story_id,
        name: data.name,
        description: data.description,
        role: data.role,
        avatar: data.avatar_url,
        traits: data.traits || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error("Get character error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to fetch character");
    }
  },

  /**
   * Update character
   */
  async updateCharacter(
    characterId: string,
    updates: Partial<Omit<Character, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Character> {
    try {
      const client = getInsforgeClient();

      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.description) updateData.description = updates.description;
      if (updates.role) updateData.role = updates.role;
      if (updates.traits) updateData.traits = updates.traits;
      if (updates.avatar) updateData.avatar_url = updates.avatar;

      const { data, error } = await client.database
        .from("characters")
        .update(updateData)
        .eq("id", characterId)
        .select()
        .single();

      if (error || !data) {
        throw new Error(error?.message || "Failed to update character");
      }

      return {
        id: data.id,
        storyId: data.story_id,
        name: data.name,
        description: data.description,
        role: data.role,
        avatar: data.avatar_url,
        traits: data.traits || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error("Update character error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to update character");
    }
  },

  /**
   * Delete character
   */
  async deleteCharacter(characterId: string): Promise<void> {
    try {
      const client = getInsforgeClient();

      const { error } = await client.database
        .from("characters")
        .delete()
        .eq("id", characterId);

      if (error) {
        throw new Error(error.message || "Failed to delete character");
      }
    } catch (error) {
      console.error("Delete character error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to delete character");
    }
  },

  /**
   * Generate avatar for existing character
   */
  async generateAvatar(
    characterId: string,
    characterName: string,
    description: string,
    storyContext?: string,
  ): Promise<string> {
    try {
      const client = getInsforgeClient();

      const avatar = await aiService.generateCharacterAvatar(
        characterName,
        description,
        storyContext,
      );

      // Update character with avatar
      await client.database
        .from("characters")
        .update({ avatar_url: avatar })
        .eq("id", characterId);

      return avatar;
    } catch (error) {
      console.error("Generate avatar error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to generate avatar");
    }
  },
};

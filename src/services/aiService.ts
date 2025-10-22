import { getInsforgeClient } from "@/lib/insforge/client";

export interface AIGenerationOptions {
  model?: "gpt-4o" | "gemini-2.5-pro" | "gemini-2.5-flash";
  temperature?: number;
  maxTokens?: number;
}

export const aiService = {
  /**
   * Generate story continuation using AI
   */
  async generateStoryResponse(
    userText: string,
    storyContext?: string,
    options?: AIGenerationOptions,
  ): Promise<string> {
    try {
      const client = getInsforgeClient();

      const model = options?.model || "gemini-2.5-pro";
      const temperature = options?.temperature ?? 0.7;
      const maxTokens = options?.maxTokens ?? 500;

      // Build system prompt
      const systemPrompt = `You are a creative writing assistant for MysticWriter. 
Your role is to help users continue their stories with engaging, coherent narrative.
${storyContext ? `Story context: ${storyContext}` : ""}
Write in a compelling, narrative style that matches the user's tone and genre.
Keep responses focused and engaging, typically 2-4 sentences.`;

      // Use correct model format based on selected model
      const modelFormat = model.startsWith("gpt")
        ? `openai/${model}`
        : `google/${model}`;

      const response = await client.ai.chat.completions.create({
        model: modelFormat,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userText,
          },
        ],
        temperature,
        maxTokens,
      });

      // Response is OpenAI-compatible format (not wrapped in { data, error })
      if (!response?.choices?.[0]?.message?.content) {
        console.error("Invalid AI response format:", response);
        throw new Error("Invalid response format from AI API");
      }

      return response.choices[0].message.content;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate story response";
      console.error("AI generation error:", errorMessage);

      // Return a fallback response instead of throwing
      return "The story continues... Tell me more about what happens next.";
    }
  },

  /**
   * Generate character description using AI
   */
  async generateCharacterDescription(
    characterName: string,
    traits: string,
  ): Promise<string> {
    try {
      const client = getInsforgeClient();

      const response = await client.ai.chat.completions.create({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content:
              "You are a creative character designer. Generate a vivid, engaging character description based on the provided information.",
          },
          {
            role: "user",
            content: `Create a detailed character description for ${characterName} with these traits: ${traits}. Keep it to 2-3 sentences.`,
          },
        ],
        temperature: 0.8,
        maxTokens: 200,
      });

      if (!response?.choices?.[0]?.message?.content) {
        throw new Error("Failed to generate character description");
      }

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Character description error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to generate character description");
    }
  },

  /**
   * Generate character avatar using AI image generation and store in bucket
   * Returns object with url and key for storage
   */
  async generateCharacterAvatar(
    characterName: string,
    description: string,
    storyContext?: string,
  ): Promise<{ url: string; key: string }> {
    try {
      const client = getInsforgeClient();

      const contextInfo = storyContext
        ? `Story context: ${storyContext}. `
        : "";
      const prompt = `Create a fantasy character portrait in the size of 96x96 for ${characterName}. ${description}. 
${contextInfo}High quality, detailed, professional illustration style. Character-focused composition.`;

      // Image generation returns OpenAI format directly (not wrapped in { data, error })
      const response = await client.ai.images.generate({
        model: "google/gemini-2.5-flash-image-preview",
        prompt,
      });

      console.log("Avatar API Response:", response);

      if (!response?.data?.[0]) {
        console.error("Invalid avatar response format:", response);
        throw new Error("Invalid response format from image generation API");
      }

      // Get image data (base64 or URL)
      const imageData = response.data[0].b64_json || response.data[0].url;
      if (!imageData) {
        throw new Error("No image URL or base64 data in response");
      }

      // If it's base64, convert to blob and upload to storage
      if (response.data[0].b64_json) {
        try {
          const base64Data = response.data[0].b64_json;
          // Convert base64 to blob (browser-compatible)
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: "image/png" });

          const resizedBlob = await new Promise(async (resolve) => {
            const img = await createImageBitmap(blob);
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext("2d");

            // Draw the image resized
            ctx?.drawImage(img, 0, 0, 512, 512);

            // Export as compressed WebP (much smaller than PNG)
            canvas.toBlob(
              (blob) => resolve(blob),
              "image/webp",
              0.7, // quality (0–1)
            );
          });
          const fileName = `avatar-${characterName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.png`;

          const { data: uploadData, error: uploadError } = await client.storage
            .from("character-avatars")
            .upload(fileName, resizedBlob as Blob);

          if (uploadError) {
            console.error("Avatar upload error:", uploadError);
            console.warn("Using base64 fallback for avatar");
            return { url: `data:image/png;base64,${base64Data}`, key: "" };
          }

          // uploadData contains { url, key }
          if (uploadData?.url) {
            console.log("Avatar uploaded successfully:", uploadData.url);
            return {
              url: uploadData.url,
              key: uploadData.key || fileName,
            };
          }

          // Fallback if url is not in response
          console.warn("No URL in upload response, using base64 fallback");
          return { url: `data:image/png;base64,${base64Data}`, key: "" };
        } catch (uploadErr) {
          console.error("Avatar storage error:", uploadErr);
          console.warn("Using base64 fallback for avatar");
          return {
            url: `data:image/png;base64,${response.data[0].b64_json}`,
            key: "",
          };
        }
      }

      // If it's already a URL, return it directly
      return { url: imageData, key: "" };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate character avatar";
      console.error("Avatar generation error:", errorMessage);

      // Return empty object as fallback (character will be created without avatar)
      return { url: "", key: "" };
    }
  },

  /**
   * Generate random character based on story context
   */
  async generateRandomCharacter(
    storyTitle: string,
    storyContext?: string,
  ): Promise<{ name: string; description: string }> {
    try {
      const client = getInsforgeClient();

      const contextInfo = storyContext
        ? `Story context: ${storyContext.substring(0, 300)}`
        : "";

      const response = await client.ai.chat.completions.create({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content:
              "You are a creative character generator for stories. Generate unique, interesting characters that fit the story's theme and genre.",
          },
          {
            role: "user",
            content: `Generate a random character for a story titled "${storyTitle}". ${contextInfo}

Return ONLY a JSON object with this exact format (no markdown, no extra text):
{"name": "Character Name", "description": "A vivid 2-3 sentence description of their appearance, personality, and role"}`,
          },
        ],
        temperature: 0.9,
        maxTokens: 200,
      });

      if (!response?.choices?.[0]?.message?.content) {
        throw new Error("Failed to generate character");
      }

      const content = response.choices[0].message.content.trim();
      // Remove markdown code blocks if present
      const jsonContent = content.replace(/```json\n?|\n?```/g, "").trim();
      const characterData = JSON.parse(jsonContent);

      return {
        name: characterData.name || "Mysterious Stranger",
        description:
          characterData.description ||
          "A mysterious figure whose past remains unknown.",
      };
    } catch (error) {
      console.error("Random character generation error:", error);
      // Return fallback character
      return {
        name: "Wandering Traveler",
        description:
          "A mysterious figure cloaked in shadows, with stories untold and secrets hidden in their eyes.",
      };
    }
  },

  /**
   * Generate story title suggestions
   */
  async generateStoryTitles(
    storyContent: string,
    count: number = 3,
  ): Promise<string[]> {
    try {
      const client = getInsforgeClient();

      const response = await client.ai.chat.completions.create({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content:
              "You are a creative title generator for stories. Generate compelling, engaging titles.",
          },
          {
            role: "user",
            content: `Generate ${count} creative story titles for this content: "${storyContent.substring(0, 200)}...". 
Return only the titles, one per line, without numbering or additional text.`,
          },
        ],
        temperature: 0.9,
        maxTokens: 150,
      });

      if (!response?.choices?.[0]?.message?.content) {
        throw new Error("Failed to generate titles");
      }

      const titles = response.choices[0].message.content
        .split("\n")
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0)
        .slice(0, count);

      return titles.length > 0 ? titles : ["Untitled Story"];
    } catch (error) {
      console.error("Title generation error:", error);
      // Return default titles on error
      return ["Untitled Story", "New Adventure", "The Journey Begins"];
    }
  },

  /**
   * Analyze story tone and suggest writing improvements
   */
  async analyzeStoryTone(storyContent: string): Promise<{
    tone: string;
    suggestions: string[];
  }> {
    try {
      const client = getInsforgeClient();

      const { data, error } = await client.ai.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a writing coach. Analyze the tone of the story and provide constructive suggestions for improvement.",
          },
          {
            role: "user",
            content: `Analyze this story and provide feedback:
"${storyContent}"

Respond in JSON format: {"tone": "description of tone", "suggestions": ["suggestion1", "suggestion2", "suggestion3"]}`,
          },
        ],
        temperature: 0.7,
        maxTokens: 300,
      });

      if (error || !data?.choices?.[0]?.message?.content) {
        throw new Error(error?.message || "Failed to analyze story");
      }

      try {
        const result = JSON.parse(data.choices[0].message.content);
        return result;
      } catch {
        return {
          tone: "Unable to determine",
          suggestions: ["Continue writing to develop the story further"],
        };
      }
    } catch (error) {
      console.error("Story analysis error:", error);
      return {
        tone: "Unknown",
        suggestions: ["Keep writing and developing your story"],
      };
    }
  },
};

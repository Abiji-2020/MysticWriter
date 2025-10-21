import { createClient } from "@insforge/sdk";

const INSFORGE_API_URL =
  import.meta.env.VITE_INSFORGE_API_URL || "https://localhost:7130";

// Singleton client instance
let clientInstance: ReturnType<typeof createClient> | null = null;

/**
 * Get or create the InsForge SDK client instance
 * Uses singleton pattern to ensure only one client is created
 */
export const getInsforgeClient = () => {
  if (!clientInstance) {
    clientInstance = createClient({ baseUrl: INSFORGE_API_URL });
  }
  return clientInstance;
};

export default getInsforgeClient;

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INSFORGE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare const vitest: typeof import('vitest');

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  // add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

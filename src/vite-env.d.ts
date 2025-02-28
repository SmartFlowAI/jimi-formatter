/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_JIMI_CONTENT: string
  readonly VITE_JIMI_STYLE: string
  readonly VITE_SINGLE_FILE_RENDER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

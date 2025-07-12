import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";
import { viteSingleFile } from "vite-plugin-singlefile";
import process from "node:process";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    process.env.VITE_SINGLE_FILE_RENDER === "True" ? viteSingleFile() : null,
    visualizer({ open: false, filename: "./dist/stats.html" })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    },
  },
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-markdown": ["markdown-it", "marked", "markdown-it-mathjax3"],
          "vendor-highlight": ["highlight.js"],
        }
      }
    }
  }
});

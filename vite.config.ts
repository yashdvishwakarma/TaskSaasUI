import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
// @ts-ignore: missing type declarations for lovable-tagger
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
    css: {
    postcss: './postcss.config.js',
  },
  optimizeDeps: {
    include: ["recharts","html2canvas"],
  },
   build: {
    commonjsOptions: {
      include: [/html2canvas/, /node_modules/]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

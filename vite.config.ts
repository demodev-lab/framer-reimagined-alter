import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/webhook': {
        target: 'https://songssam.demodev.io',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  plugins: [
    react(),
    // Lovable componentTagger 비활성화 - N8N 장시간 요청 시 자동 새로고침 방지
    // mode === 'development' &&
    // componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

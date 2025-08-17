import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "client", "src", "assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  define: {
    'import.meta.env.VITE_SITE_DEPLOYMENT_TYPE': JSON.stringify(process.env.SITE_DEPLOYMENT_TYPE),
    'import.meta.env.VITE_DEV_PASSWORD': JSON.stringify(process.env.VITE_DEV_PASSWORD),
    'import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID': JSON.stringify(process.env.VITE_DYNAMIC_ENVIRONMENT_ID),
  },
  // Server configuration for standalone development
  // When used with middleware mode, these settings are overridden
  server: {
    host: '0.0.0.0', // Listen on all interfaces, not just localhost
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
      host: 'localhost'
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    // Allow delu.la domain for production deployment
    allowedHosts: ['localhost', '127.0.0.1', 'delu.la', 'www.delu.la', '.delu.la'],
  },
});

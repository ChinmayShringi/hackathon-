import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client", "src"),
      "@shared": path.resolve(process.cwd(), "shared"),
      "@assets": path.resolve(process.cwd(), "client", "src", "assets"),
    },
  },
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(process.cwd(), "dist/public"),
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
    port: 5232,
    strictPort: true,
    hmr: {
      port: 5232,
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

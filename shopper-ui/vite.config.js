import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 }
});

/*export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api/products": { target: "http://localhost:8081", changeOrigin: true, rewrite: p => p.replace(/^\/api\/products/, "/products") },
      "/api/cart":     { target: "http://localhost:8080", changeOrigin: true }
    }
  }
});
*/
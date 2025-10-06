import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/potholes/",
  server: {
    port: 3000,
    proxy: {
      "/pothole-core/v1/api": {
        target: "http://localhost:8079",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

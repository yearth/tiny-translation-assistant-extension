import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "vite-plugin-web-extension";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: "./public/manifest.json",
      webExtConfig: {
        // 浏览器扩展的配置选项
        startUrl: ["https://www.google.com"],
        target: "chromium",
      },
      browser: "chrome", // 或者 "firefox", "edge" 等
      // 配置内容脚本和其他入口点
      additionalInputs: [
        "src/content/index.ts",
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === "development",
  },
});

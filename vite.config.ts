import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "vite-plugin-web-extension";
import path from "path";
import fs from "fs-extra";

// https://vite.dev/config/
export default defineConfig({
  // 使用项目根目录下的 postcss.config.js
  css: {
    postcss: {}, // 空对象会使用默认配置文件
  },
  plugins: [
    react(),
    // 自定义插件：将 shadow-dom.css 复制到扩展根目录
    {
      name: "copy-shadow-dom-css",
      apply: "build",
      closeBundle: async () => {
        try {
          const src = path.resolve(
            __dirname,
            "dist/src/content/shadow-dom.css"
          );
          const dest = path.resolve(__dirname, "dist/shadow-dom.css");

          if (fs.existsSync(src)) {
            console.log(`\n复制 ${src} 到 ${dest}`);
            await fs.copy(src, dest);
            console.log("复制成功！\n");
          } else {
            console.error(`错误：文件 ${src} 不存在`);
          }
        } catch (error) {
          console.error("复制 shadow-dom.css 时出错:", error);
        }
      },
    },
    webExtension({
      manifest: "./public/manifest.json",
      webExtConfig: {
        // 浏览器扩展的配置选项
        startUrl: ["https://www.google.com"],
        target: "chromium",
      },
      browser: "chrome", // 或者 "firefox", "edge" 等
      // 配置内容脚本和其他入口点
      additionalInputs: ["src/content/index.ts"],
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
    sourcemap: true, // 始终生成源映射以便于调试
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // 将所有 CSS 文件放在根目录下
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "[name][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});

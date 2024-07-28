import { defineConfig, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

const pathSrc = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig((): UserConfig => {
  return {
    resolve: {
      alias: {
        "@": pathSrc,
      },
    },
    plugins: [vue()],
  };
});

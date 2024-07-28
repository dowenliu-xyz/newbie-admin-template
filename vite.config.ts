import { defineConfig, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ElementPlus from "unplugin-element-plus/vite";
import { resolve } from "path";
import UnoCSS from "unocss/vite";

const pathSrc = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig((): UserConfig => {
  return {
    resolve: {
      alias: {
        "@": pathSrc,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `,
        },
      },
    },
    plugins: [vue(), ElementPlus({}), UnoCSS({ hmrTopLevelAwait: false })],
  };
});

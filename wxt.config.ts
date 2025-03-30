import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  extensionApi: "chrome",
  manifest: {
    permissions: ["tabs", "storage", "identity"],
  },
  modules: ["@wxt-dev/module-react"],
});

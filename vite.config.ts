import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), vueJsx(), vueDevTools()],
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				admin: resolve(__dirname, "admin.html"),
				restore: resolve(__dirname, "restore.html")
			}
		}
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url))
		}
	}
});

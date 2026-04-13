import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import pluginVitest from "@vitest/eslint-plugin";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default [
	{
		name: "app/files-to-lint",
		files: ["**/*.{ts,mts,tsx,vue}"]
	},

	{
		name: "app/files-to-ignore",
		ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]
	},

	...pluginVue.configs["flat/essential"],
	...vueTsEslintConfig(),
	{
		name: "app/custom-rules",
		files: ["**/*.{ts,mts,tsx,vue}"],
		rules: {
			"no-console": ["error", { allow: ["error", "warn"] }],
			"no-debugger": "error",
			"no-var": "error",
			"prefer-const": "error",
			quotes: ["error", "double", { avoidEscape: true }],
			semi: ["error", "always"]
		}
	},
	{
		...pluginVitest.configs.recommended,
		files: ["src/**/__tests__/*"]
	},
	skipFormatting
];

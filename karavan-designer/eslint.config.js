import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default defineConfig(
  { ignores: ["dist", "node_modules", "public"] },
  { plugins: { prettier: prettier }, rules: { "prettier/prettier": "warn" } },
  eslint.configs.recommended,
  tseslint.configs.recommended
);

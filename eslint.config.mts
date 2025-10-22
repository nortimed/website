import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "dist/",
      "coverage/",
      "public/",
      "src/components/ui/",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.browser },
    plugins: {
      "unused-imports": (await import("eslint-plugin-unused-imports")).default,
      "react-hooks": (await import("eslint-plugin-react-hooks")).default,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "warn",
    },
  },
  tseslint.configs.recommended,
]);

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable strict mode rules
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off", // Changed from warn to off
      "react-hooks/exhaustive-deps": "off",
      "@next/next/no-img-element": "off",
      "strict": "off",
      "no-var": "off", // Added to allow var in global declarations
      "prefer-const": "off" // Added to allow let instead of const
    },
  },
];

export default eslintConfig;

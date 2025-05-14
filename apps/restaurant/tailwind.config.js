import sharedConfig from "@repo/tailwind-config";

/** @type {import('tailwindcss').Config} */
export default {
  ...sharedConfig,
  content: [...sharedConfig.content, "./src/**/*.{js,ts,jsx,tsx}"]
}; 
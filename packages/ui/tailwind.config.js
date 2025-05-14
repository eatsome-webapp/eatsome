const sharedConfig = require("@repo/tailwind-config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedConfig,
  darkMode: "class",
  content: [...sharedConfig.content],
}; 
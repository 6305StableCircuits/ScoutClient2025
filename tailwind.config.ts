import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily:{
        Inter:["Inter","sans-serif"]
      }
    }
  },

  plugins: []
} as Config;

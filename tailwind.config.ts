import type { Config } from "tailwindcss";
import colors from 'tailwindcss/colors';
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        colors: {
            specialgreen: `#03c12b`,
            specialblue: '#135fef',
            specialred: '#ef0305',
            ...colors
        },
        extend: {
            fontFamily:{
                Inter:["Inter","sans-serif"]
            }
        }
    },
    plugins: []
} as Config;

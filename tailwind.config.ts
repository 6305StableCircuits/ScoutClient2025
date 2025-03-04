import type { Config } from "tailwindcss";
import colors from 'tailwindcss/colors';
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        colors: {
            specialgreen: `#03c12b`,
            specialblue: '#135fef',
            specialred: '#ef0305',
            primary: "#B1B2CB",
            secondary: "#393A60",
            WinGreen: "#549C47",
            LoseRed: "#D50306",
            SubmitBlue: "#3445FF",
            ExtraBlue: "#3682C5",
            ExtraGreen: "rgba(54, 197, 68, 0.52)",
            ExtraOrange: "#FF8559",
            ExtraSlightlyDarkOrange: "#bf6443",
            ExtraLightBlue: "#31A8C0",
            GrayedOutText: "rgba(91, 90, 90, 1)",
            ...colors
        },
        extend: {
            fontFamily:{
                Inter:["Inter","sans-serif"]
            }
        }
    },
    plugins: [ require("@tailwindcss/forms")({
        strategy: 'class'
      })]
} as Config;

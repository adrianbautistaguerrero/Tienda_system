/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta neutra: blanco, gris, beige y azul suave
        marca: {
          azul: "#4a6fa5",
          azulClaro: "#7d9bc7",
          beige: "#f3efe7",
          beigeOscuro: "#e6ddcc",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

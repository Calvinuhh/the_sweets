export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxtjs/google-fonts",
  ],

  devServer: {
    port: 3001,
  },

  runtimeConfig: {
    public: {
      SERVER_URL: "",
      GOOGLE_CLIENT_ID: "",
    },
  },
  googleFonts: {
    families: {
      Cinzel: true,
      "Moon Dance": true,
      Lato: true,
    },
  },
});

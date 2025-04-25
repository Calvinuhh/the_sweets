// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxt/icon"],

  devServer: {
    port: 3001,
  },

  runtimeConfig: {
    public: {
      SERVER_URL: "",
    },
  },
});

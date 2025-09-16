// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_ANON_KEY,
    redirectOptions: {
      login: "/",
      callback: "/account",
      exclude: ["*"],
    },
  },
  // Modules
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          "Fredoka One": [400], // Fun, rounded font for headings
          Nunito: [400, 600, 700], // Friendly font for body text
          "Noto Sans SC": [400, 500, 700], // Chinese character support
        },
      },
    ],
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  // // App configuration
  // app: {
  //   head: {
  //     title: "Chinese Learning Fun!",
  //     meta: [
  //       { charset: "utf-8" },
  //       { name: "viewport", content: "width=device-width, initial-scale=1" },
  //       {
  //         name: "description",
  //         content: "Fun Chinese language learning app for kids",
  //       },
  //     ],
  //   },
  // },

  // // Runtime configuration
  // runtimeConfig: {
  //   public: {
  //     appName: "Chinese Learning Fun!",
  //   },
  // },

  // // Enable experimental features for better performance
  // experimental: {
  //   payloadExtraction: false,
  // },
});

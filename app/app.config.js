import 'dotenv/config';

export default {
  expo: {
    name: "IGO Manager",
    slug: "igo-manager",
    version: "1.0.0",
    orientation: "portrait",

    platforms: ["ios", "android", "web"],

    scheme: "igo-manager",

    ios: {
      bundleIdentifier: "com.dinamica.igo.manager",
    },

    android: {
      package: "com.dinamica.igo.manager",
    },

    plugins: ["expo-notifications"],

    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  },
};
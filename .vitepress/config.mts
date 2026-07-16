import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Light Rider Docs",
  description: "Documentation for Light Rider's products and services.",
  base: "/docs/",

  head: [
    [
      "link",
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
    ],
    [
      "link",
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Science+Gothic:wght@100..900&display=swap",
      },
    ],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    logo: {
      light: "/LR-logo-light.png",
      dark: "/LR-logo-dark.png",
      alt: "Light Rider Logo",
    },
    siteTitle: false,

    nav: [
      { text: "Platform", link: "https://platform.lightriderinc.com/" },
      { text: "Light Rider Website", link: "https://www.lightriderinc.com/" },
    ],

    sidebar: {
      "/sdk/": [
        {
          text: "Light Rider SDK",
          items: [
            { text: "Getting Started", link: "/sdk/getting-started" },

            { text: "Quantum Circuits", link: "/sdk/quantum-circuits" },
            {
              text: "Quantum Random Numbers",
              link: "/sdk/quantum-random-numbers",
            },
            { text: "Synthetic Data", link: "/sdk/synthetic-data" },
          ],
        },
      ],
    },

    // socialLinks: [
    //   { icon: "github", link: "https://github.com/vuejs/vitepress" },
    // ],
  },
});

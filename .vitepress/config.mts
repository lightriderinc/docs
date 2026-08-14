import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Light Rider Docs",
  description: "Documentation for Light Rider's products and services.",
  base: "/",

  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],

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
      light: "/LR-docs-logo-light.png",
      dark: "/LR-docs-logo-dark.png",
      alt: "Light Rider Logo",
    },
    siteTitle: false,

    nav: [
      { text: "Cloud platform", link: "platform/introduction" },
      { text: "PQC", link: "pqc/policy" },

      { text: "EMS", link: "entropy/introduction" },
      {
        text: "Launch Cloud platform",
        link: "https://platform.lightriderinc.com/",
      },
      { text: "Light Rider Website", link: "https://www.lightriderinc.com/" },
    ],

    sidebar: {
      "/entropy/": [
        {
          text: "Entropy Management System",
          collapsed: true,
          items: [
            {
              text: "What is Light Rider EMS?",
              link: "/entropy/introduction",
            },
            { text: "Quickstart", link: "/entropy/quickstart" },
          ],
        },
        {
          text: "Request entropy",
          collapsed: true,
          items: [
            { text: "Policies", link: "/entropy/policies" },
            {
              text: "Multi-source extraction",
              link: "/entropy/multi-source",
            },
            { text: "Streaming entropy", link: "/entropy/streaming" },
          ],
        },
        {
          text: "Verify & audit",
          collapsed: true,
          items: [
            { text: "Receipts & verification", link: "/entropy/receipts" },
          ],
        },
        {
          text: "Operate",
          collapsed: true,
          items: [
            {
              text: "Sources & collectors",
              link: "/entropy/sources-collectors",
            },
          ],
        },
        {
          text: "Build",
          collapsed: true,
          items: [{ text: "Synthetic data", link: "/entropy/synthetic-data" }],
        },
        {
          text: "Reference",
          collapsed: true,
          items: [{ text: "API reference", link: "/entropy/api-reference" }],
        },
      ],
      "/platform/": [
        {
          text: "Get started",
          collapsed: true,
          items: [
            {
              text: "What is Light Rider Cloud?",
              link: "/platform/introduction",
            },
            { text: "Getting started", link: "/platform/getting-started" },
          ],
        },
        {
          text: "Compute",
          collapsed: true,
          items: [
            { text: "Dashboard", link: "/platform/dashboard" },
            { text: "Backends", link: "/platform/backends" },
            { text: "Jobs & results", link: "/platform/jobs" },
          ],
        },
        {
          text: "Explore",
          collapsed: true,
          items: [{ text: "Applications", link: "/platform/applications" }],
        },
        {
          text: "Account",
          collapsed: true,
          items: [{ text: "API keys", link: "/platform/api-keys" }],
        },
        {
          text: "Light Rider SDK",
          collapsed: true,
          items: [
            { text: "Getting Started", link: "/platform/sdk/getting-started" },
            {
              text: "Quantum Circuits",
              link: "/platform/sdk/quantum-circuits",
            },
            {
              text: "Quantum Error Correction",
              link: "/platform/sdk/stabilizer-qec",
            },
            {
              text: "Quantum Random Numbers",
              link: "/platform/sdk/quantum-random-numbers",
            },
            { text: "Synthetic Data", link: "/platform/sdk/synthetic-data" },
          ],
        },
      ],
      "/pqc/": [
        {
          text: "Policy",
          collapsed: true,
          items: [{ text: "U.S. Quantum Policy", link: "/pqc/policy" }],
        },
        {
          text: "Get started",
          collapsed: true,
          items: [
            { text: "What is Light Rider PQC?", link: "/pqc/introduction" },
            { text: "Quickstart", link: "/pqc/quickstart" },
          ],
        },
        {
          text: "Discover & inventory",
          collapsed: true,
          items: [{ text: "Cryptographic discovery", link: "/pqc/discovery" }],
        },
        {
          text: "Reference",
          collapsed: true,
          items: [{ text: "SDK & CLI reference", link: "/pqc/sdk-reference" }],
        },
      ],
    },

    // socialLinks: [
    //   { icon: "github", link: "https://github.com/vuejs/vitepress" },
    // ],
  },
});

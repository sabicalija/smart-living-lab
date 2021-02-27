const base = require("./config/base.js");

module.exports = {
  base,
  dest: "build",
  themeConfig: {
    displayAllHeaders: true,
    locales: {
      "/": {
        selectText: "Sprachen",
        label: "Deutsch",
        ariaLabel: "Sprachen",
        editLinkText: "Editiere diese Seite auf GitHub",
        nav: [
          { text: "Home", link: "/" },
          { text: "Tour", link: "/tour/" },
          // { text: "Geräte", link: "/devices/" },
          // { text: "Netzwerk", link: "/network/" },
        ],
        sidebar: {
          "/tour/": ["", "network", "devices"],
        },
      },
      "/en/": {
        selectText: "Languages",
        label: "English",
        ariaLabel: "Languages",
        editLinkText: "Edit this page on GitHub",
        nav: [
          { text: "Home", link: "/en/", ariaLabel: "Home" },
          { text: "Tour", link: "/en/tour/", ariaLabel: "Tour" },
          // { text: "Devices", link: "/en/devices/", ariaLabel: "Devices" },
          // { text: "Network", link: "/en/network/", ariaLabel: "Network" },
        ],
        sidebar: {
          "/en/tour/": ["", "network", "devices"],
        },
      },
      "/zh/": {
        selectText: "选择语言",
        label: "简体中文",
        ariaLabel: "选择语言",
        editLinkText: "在 GitHub 上编辑此页",
        nav: [
          { text: "家", link: "/zh/", ariaLabel: "Home" },
          { text: "旅游", link: "/zh/tour/", ariaLabel: "Tour" },
          // { text: "设备", link: "/zh/devices/", ariaLabel: "Devices" },
          // { text: "网络", link: "/zh/network/", ariaLabel: "Network" },
        ],
        sidebar: {
          "/zh/tour/": ["", "network", "devices"],
        },
      },
    },
  },
  markdown: {
    extendMarkdown: (md) => {
      md.use(require("markdown-it-sub"));
      md.use(require("markdown-it-sup"));
      md.use(require("markdown-it-video"));
    },
  },
  locales: {
    "/": {
      lang: "de-AT",
      title: "Smart Living Labor",
      description: "Labor für Smart Homes und Assistive Technologien",
    },
    "/en/": {
      lang: "en-US",
      title: "Smart Living Lab",
      description: "Lab for Smart Homes and Assistive Technologies",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "智能家居实验室",
      description: "智能家居和辅助技术实验室",
    },
  },
};

const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // "@layout-header-background": "white",
              // "@layout-sider-background": "#253b65",
              // "@table-header-bg": "#b2b2b2",
              // "@table-header-sort-bg": "darken(#b2b2b2, 5%)",
              // "@table-header-sort-active-bg": "darken(#b2b2b2, 5%)",
              // "@menu-bg": "#253b65",
              // "@menu-item-active-bg": "#b2b2b2",
              // "@menu-inline-submenu-bg": "#253b65",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};

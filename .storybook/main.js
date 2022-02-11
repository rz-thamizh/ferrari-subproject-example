const path = require('path');
const resolve = (file) => path.resolve(__dirname, file);

module.exports = {
  stories: [
    // No easy way to exclude node_modules, so adding possible folders
    "../roanuz/**/*.stories.@(js|jsx|ts|tsx)",
    "../tl/**/*.stories.@(js|jsx|ts|tsx)",

    // All stories from stories folder
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    config.resolve.alias['@'] = resolve('../');


    // https://duncanleung.com/import-svg-storybook-webpack-loader/
    // Add SVGR Loader
    // ========================================================
    const assetRule = config.module.rules.find(({ test }) => test.test(".svg"));
    const assetLoader = {
      loader: assetRule.loader,
      options: assetRule.options || assetRule.query
    };
    // Merge our rule with existing assetLoader rules
    config.module.rules.unshift({
      test: /\.svg$/,
      use: [{
        loader: "@svgr/webpack",
        options: {
          // replaceAttrValues: {'#333': 'currentValue'},
          svgoConfig: {
            plugins: [
              { removeXMLNS: true },
              { removeViewBox: false },
              { removeDimensions: true },
              // {
              //   removeAttributesBySelector: {
              //     selectors: [
              //       { selector: '[fill=\'#333\']', attributes: ['fill'] },
              //     ],
              //   }
              // },
              // {
              //   removeAttrs: {
              //     attrs: 'svg:(stroke|fill):none',
              //   },
              // }
            ]
          }
        },
      }, assetLoader]
    });

    config.module.rules.push({
      test: /\.(s*)css$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader'],
      include: resolve('../roanuz/styles/storybook.scss'),
    });
    

    return config;
  },
}
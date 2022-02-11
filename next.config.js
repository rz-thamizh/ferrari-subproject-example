/* eslint-disable no-unused-vars */

module.exports = {
  webpack: (config, {
    buildId, dev, isServer, defaultLoaders, webpack,
  }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))

    const rule = config.module.rules[0];
    const originalExcludeMethod = rule.exclude;
    config.module.rules[0].exclude = (moduleName, ...otherArgs) => {
      // we want to explicitly allow our plugin
      if (moduleName.indexOf("node_modules/next-subproject-ferrari") >= 0) {
        return false;
      }

      // otherwise, use the original rule
      return originalExcludeMethod(moduleName, ...otherArgs);
    };

    const websiteKey = process.env.NEXT_PUBLIC_RZ_WEBSITE_KEY || 'rz';
    console.log('Building for Website', websiteKey);

    config.module.rules.push({
      test: /\.(jpg|png)$/,
      use: {
        loader: 'url-loader',
      },
    });

    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'graphql-tag/loader',
        },
      ],
    });

    // config.module.rules.push({
    //   test: /\.svg$/,
    //   issuer: {
    //     test: /\.(js|ts)x?$/,
    //   },
    //   use: ['@svgr/webpack'],
    // });

    // https://duncanleung.com/import-svg-storybook-webpack-loader/
    // Add SVGR Loader
    // ========================================================
    const assetRule = config.module.rules.find(({ test }) => test && test.test('.svg'));
    const assetLoader = assetRule && {
      loader: assetRule.loader,
      options: assetRule.options || assetRule.query,
    };

    const svgLoders = [
      {
        loader: '@svgr/webpack',
        options: {
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
              //   },
              // },
              // {
              //   removeAttrs: {
              //     attrs: 'svg:(stroke|fill):none',
              //   },
              // },
            ],
          },
        },
      },
    ];

    if (assetLoader) {
      svgLoders.push(assetLoader);
    } else {
      svgLoders.push('url-loader');
    }

    config.module.rules.unshift({
      test: /\.svg$/,
      use: svgLoders,
    });

    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /(.*)_WEBSITE_KEY_(\.*)/,
        (resource) => {
          const resolvedPath = resource.request.replace(
            /_WEBSITE_KEY_/,
            `${websiteKey}`,
          );
          console.log(`Replacing Import ${resource.request} 👉 ${resolvedPath}`);
          // eslint-disable-next-line no-param-reassign
          resource.request = resolvedPath;
        },
      ),
    );

    return config;
  },
  distDir: process.env.BUILD_DIR || 'build',
  webpack5: false,
};

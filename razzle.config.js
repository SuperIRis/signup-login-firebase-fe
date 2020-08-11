const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const postCSSOptions = {
  ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
  plugins: () => [
    require('postcss-modules-values'),
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
  ],
};

const devConfig = [
  require.resolve('style-loader'),
  {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
      modules: {
        auto: true,
        localIdentName: '[name]__[local]___[hash:base64:5]',
      },
    },
  },
  {
    loader: require.resolve('postcss-loader'),
    options: postCSSOptions,
  },
];

const nodeConfig = [
  {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
      modules: {
        auto: true,
        localIdentName: '[name]__[local]___[hash:base64:5]',
      },
      onlyLocals: true,
    },
  },
];

const defaultConfig = [
  MiniCssExtractPlugin.loader,
  {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
      modules: {
        auto: true,
        localIdentName: '[name]__[local]___[hash:base64:5]',
      },
    },
  },
  {
    loader: require.resolve('postcss-loader'),
    options: postCSSOptions,
  },
];

function findCSSRuleFromConfig(ruleConfig) {
  return ruleConfig.find((item) => {
    const cssRegEx = /\.css$/;
    return (
      item.test instanceof RegExp &&
      cssRegEx instanceof RegExp &&
      item.test.source === cssRegEx.source &&
      item.test.global === cssRegEx.global &&
      item.test.ignoreCase === cssRegEx.ignoreCase &&
      item.test.multiline === cssRegEx.multiline
    );
  });
}

function replaceCSSLoader(ruleConfig, newConfig) {
  ruleConfig.use = newConfig;
}
module.exports = {
  //plugins: [{ func: modify }],
  modify: (config, { target, dev }, webpack) => {
    if (!config.devServer) {
      config.devServer = {};
    }
    if (target === 'node') {
      replaceCSSLoader(findCSSRuleFromConfig(config.module.rules), nodeConfig);
    } else if (dev) {
      replaceCSSLoader(findCSSRuleFromConfig(config.module.rules), devConfig);
    } else {
      replaceCSSLoader(findCSSRuleFromConfig(config.module.rules), defaultConfig);
    }
    if (dev) {
      //replace css loader rules with standard css-loader and custom postCSSOptions

      //Read local SSL files to be able to test in https in localhost
      config.devServer.https = {
        key: fs.readFileSync('./ssl2/localhost+2-key.pem'),
        cert: fs.readFileSync('./ssl2/localhost+2.pem'),
      };
    }
    config.plugins = [...config.plugins, require('postcss-modules-values')];
    config.node = {
      fs: 'empty', //this is to prevent webpack to attempt to load fs module in the bundle for client app (we are using it conditionally only on server)
    };
    if (target === 'node' && !dev) {
      config.entry = path.resolve(__dirname, './src/server.js');
      config.output.filename = 'server.bundle.js';
      config.output.path = path.resolve(__dirname, './server/build');
      config.output.libraryTarget = 'commonjs2';
    }
    config.performance = {
      hints: false, //remove after looking into optimizing (lazy loading?)
      maxEntrypointSize: 600000,
    };
    return config;
  },
};

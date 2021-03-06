import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import WatchMissingNodeModulesPlugin from
  'react-dev-utils/WatchMissingNodeModulesPlugin';

const env = process.env.NODE_ENV || 'production';
const useAlias = process.env.USE_ALIAS;

let plugins = [
  new CopyWebpackPlugin([{ from: './public' }]),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(env)
    }
  }),
  new webpack.optimize.OccurrenceOrderPlugin()
  // new webpack.optimize.DedupePlugin()
];

const devConfig = {};
if (env === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    })
  );
} else {
  plugins = plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new WatchMissingNodeModulesPlugin('./node_modules')
  ]);
  devConfig.devtool = 'cheap-module-source-map';
  devConfig.entry = [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    './src/js/index.js'
  ];
  if (useAlias) {
    console.log('Using webpack alias for development');
    devConfig.resolve = {
      alias: {
        'grommet-addons': path.resolve(
          __dirname, '../grommet-addons/src/js'
        ),
        'grommet/scss': path.resolve(__dirname, '../grommet/src/scss'),
        grommet: path.resolve(__dirname, '../grommet/src/js')
      }
    };
  }
}

export default Object.assign({
  entry: './src/js/index.js',
  output: {
    path: path.resolve('./dist'),
    filename: 'static/index.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.scss', '.css', '.json']
  },
  plugins,
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loaders: ['babel']
      },
      {
        test: /\.json/,
        loaders: ['json']
      },
      {
        test: /\.scss$/,
        loader: 'file?name=static/[name].css!sass?outputStyle=compressed'
      }
    ]
  },
  sassLoader: {
    includePaths: [
      './node_modules'
    ]
  }
}, devConfig);

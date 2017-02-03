import webpackConfig from './webpack.config.babel.js';

const httpServer = `http://${process.env.HOST}`;
const wsServer = `ws://${process.env.HOST}`;

export default {
  compress: true,
  clientLogLevel: 'none',
  contentBase: webpackConfig.output.path,
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
  hot: true,
  watchOptions: {
    ignored: /node_modules/
  },
  historyApiFallback: true,
  proxy: [
    {
      context: ['/authorize', '/login', '/logout'],
      target: httpServer
    },
    {
      context: ['/api/**/*'],
      target: httpServer,
      onProxyRes: (proxyRes, req) => {
        const cookie = req.headers.cookie;
        if (cookie) {
          const token = cookie.split(';')[0].split('=')[1];
          proxyRes.headers['x-csrf-token'] = token;
        }
      }
    },
    {
      context: ['/ws/*'],
      ws: true,
      target: wsServer
    }
  ]
};

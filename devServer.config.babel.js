import webpackConfig from './webpack.config.babel.js';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import httpProxy from 'http-proxy';
import opener from 'opener';

const httpServer = `http://${process.env.HOST}`;
const wsServer = `ws://${process.env.HOST}`;
const PORT = process.env.PORT || '3000';

const devConfig = {
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
    }
  ]
};

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, devConfig);

function errorHandler(err = {}) {
  console.log('failed');
  const isArray = Array.isArray(err);
  if (isArray) {
    err.forEach(e => console.error(e.message ? e.message : e));
  } else {
    console.error(err.message ? err.message : err);
  }
}

// proxy to drone websocket
const proxy = httpProxy.createProxyServer();
proxy.on('error', () => {});
server.listeningApp.on('upgrade', (req, socket) => {
  if (req.url.match(/^\/ws\//)) {
    const cookie = req.headers.cookie;
    if (cookie) {
      const token = cookie.split(';')[0].split('=')[1];
      proxy.ws(req, socket, {
        target: wsServer,
        headers: {
          Authorization: `Bearer ${token}`
        },
        ws: true,
        changeOrigin: true
      });
    }
  }
});

let firstCompilation = true;
compiler.plugin('done', (stats) => {
  const statHandler = (stat) => {
    if (stat.compilation.errors.length) {
      errorHandler(stat.compilation.errors);
    } else {
      console.log(stat.toString({
        chunks: false,
        colors: true
      }));

      console.log('success');

      if (firstCompilation) {
        console.log(
          `Opening the browser at http://localhost:${PORT}`
        );

        opener(`http://localhost:${PORT}`);
      }

      firstCompilation = false;
    }
  };

  if (stats.stats) { // multiple stats
    stats.stats.forEach(statHandler);
  } else {
    statHandler(stats);
  }
});

console.log('Running webpack...');

server.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
});

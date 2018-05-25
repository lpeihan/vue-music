
const webpack = require('webpack');
const path = require('path');
const WebpackDevServer = require('webpack-dev-server');
const WebpackDevServerConf = require('./webpack.dev.conf');
const open = require('open');

const config = {
  port: 8300,
  host: '192.168.31.170'
};

const url = `http://${config.host}:${config.port}`;

WebpackDevServerConf.entry.app.unshift(
  `webpack-dev-server/client?${url}`,
  'webpack/hot/dev-server'
);

const compiler = webpack(WebpackDevServerConf);
const server = new WebpackDevServer(compiler, {
  proxy: {
    '/api': `http://localhost:${config.port + 1}`
  },
  hot: true,
  inline: true,
  open: true,
  compress: true,
  quiet: true,
  clientLogLevel: 'warning',
  overlay: {
    errors: true,
    warnings: false
  },
  historyApiFallback: {
    rewrites: [
      { from: /.*/, to: path.posix.join('/', 'index.html') }
    ]
  }
});

server.listen(config.port, config.host, () => {
  open(url);
});

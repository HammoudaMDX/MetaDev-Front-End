const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://meta-eta.vercel.app/, // Replace with your backend server URL
      changeOrigin: true,
    })
  );
};

import { createProxyMiddleware } from 'http-proxy-middleware';

export default function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://f433d8df7a366d4c2f9e505fdd01340b.r2.cloudflarestorage.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Remove "/api" do caminho antes de enviar a requisição
      },
    })
  );
}

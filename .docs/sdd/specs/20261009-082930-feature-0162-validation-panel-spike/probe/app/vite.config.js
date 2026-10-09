// El fallback de SPA de Vite contesta 200 en cualquier ruta: sin este middleware no hay petición fallida que medir.
export default {
  plugins: [{
    name: 'failing-api',
    configureServer(server) {
      server.middlewares.use('/api', (_request, response) => {
        response.statusCode = 500;
        response.end('{"error":"fallo provocado"}');
      });
    },
  }],
};
